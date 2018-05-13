//var sqlite3 = require('sqlite3');
var scd = require('node-schedule');
const moment = require("moment");
//const sendSpam = require('../modules/sendSpam.js');
require("moment-duration-format");

module.exports = function(XPBot) {
  const sqlite = require('../modules/dbutil.js');
  if(!XPBot.db) XPBot.db = {};

  XPBot.scdTasks = new Map();

  XPBot.db.taskScdDB = sqlite.initDB(XPBot, './db/TaskScheduler.db');

  //============================================================
  //============================================================
  const funcWrap = origFuncInfo => {
    writeLog('Log', 'タスク(' + origFuncInfo.taskId + ')の実行を開始しました');
    let _XPBot = XPBot; //origFuncInfo.XPBot;
    //console.log(_XPBot);
    
    if(origFuncInfo.cmdName == 'radioset'){

    } else if(origFuncInfo.cmdName == 'radio_ts' || origFuncInfo.cmdName == 'radio_bgm'){
      // guild: guildID
      // channel: channelname
      // date: date
      // (ts)code: code of timesignal
      // (bgm)bgm: name of bgm
      let p = origFuncInfo.params;
      //let radioGuild = _XPBot.guilds.find('name', p.guild);
      let radioGuild = _XPBot.guilds.get(p.guild);
      let radioCnl = radioGuild.channels.find(val => {
        return val.type === 'voice' && val.name === p.channel;
      });
      
      try{
        radioCnl.leave();
      } catch(e){
        console.error(e);
      }
      
      if(origFuncInfo.cmdName == 'radio_ts'){
        let tsCode = p.code;
        let waitOfCodes = {
          'chiku_sto': 10 * 1000,
          'xp_channel': 44 * 1000
        }

        radioCnl.join()
          .then(async connection => {
          let nowTime = Date.now();
          let startTime = new Date(p.date);
          let wait = startTime - nowTime - waitOfCodes[tsCode];

          if(wait < 0){
            console.error('超過');
            return;
          } 

          await _XPBot.wait(wait);
          const dispatcher = connection.playFile("././assets/TimeSignal_" + tsCode + ".mp3", { volume: 0.5 });
          dispatcher.on('end', res => {
            //radioCnl.leave();
          });
        }).catch(console.log);
      } else{
        let bgmName = p.bgm;
        
        radioCnl.join()
          .then(async connection => {
          await _XPBot.wait(50);
          const dispatcher = connection.playFile("././assets/BGM-" + bgmName + ".mp3", { volume: 0.1 });

          dispatcher.on('end', res => {
            //radioCnl.leave();
          });
        }).catch(console.log);
      }
    } /*else if(origFuncInfo.cmdName == 'send_spam'){
      // guild: guildID
      // channels: channels
      // msg: message
      // sendOpt: sendOption
      // wBef: waitBefore
      // wAft: waitAfter
      
      let p = origFuncInfo.params;
      let g = _XPBot.guilds.get(p.guild);
      //let g = _XPBot.guilds.find('name', p.guild);
      let cnls = p.channels.split(';');
      
      let wBefore = parseInt(p.wBef, 10);
      let wAfter = parseFloat(p.wAft, 10);
      
      if(isNaN(wBefore)){
        writeLog('ERR', 'p.wBef の値が不正です');
        return;
      }
      
      if(isNaN(wAfter)){
        writeLog('ERR', 'p.wAft の値が不正です');
        return;
      }
      
      sendSpam(
        _XPBot,
        g,
        cnls,
        p.msg,
        p.sendOpt,
        null,
        () => {
          _XPBot.log('SPAM', 'scheduler 送信終了', 'Log');
        },
        {waitBefore: wBefore, waitAfter: wAfter}
      );
    }*/
    writeLog('Log', 'タスク(' + origFuncInfo.taskId + ')の実行を終了しました');
    //console.log(origFuncInfo.afterStat);
    XPBot.db.taskScdDB.setStatusById(origFuncInfo.taskId, origFuncInfo.afterStat, 'all');
    XPBot.scdTasks.delete(origFuncInfo.taskId);
  };
  //============================================================
  //============================================================

  // dateはJSのDate, resend_byはnullでresend無効、0で強制resend
  XPBot.db.taskScdDB.registerTask = async (date, cmd, params, note, resend_by) => {
    let id = parseInt(moment().format('YYMMDDHHmmss'));

    let exist = await XPBot.db.taskScdDB.getTaskById(id, 'all');
    if(exist){
      writeLogDB('ERR', 'タスク(' + id + ' )は既に登録されています')
    } else{
      let dateMoment = moment(date).format('YYYY-MM-DD HH:mm:ss');

      let j = scd.scheduleJob(date, funcWrap.bind(null, {XPBot: XPBot, taskId: id, cmdName: cmd, params: params, afterStat: 'done'}));

      XPBot.scdTasks.set(id, j);

      let paramsJSON = JSON.stringify(params);
      let info = '(id: ' + id + ')';

      if(resend_by === null){ //resend 無効
        return new Promise((resolve, reject) => {
          XPBot.db.taskScdDB.run(
            'INSERT INTO tasks_noresend(id, date, cmd, params, note) VALUES($id, $date, $cmd, $params, $note)',
            {$id: id, $date: dateMoment, $cmd: cmd, $params: paramsJSON, $note: note},
            function(err){
              if(err) {
                writeLogDB('ERR', 'タスクスケジュールDBへの期限厳守タスク登録に失敗しました ' + info);
                reject(err);
              }
              writeLogDB('Log', 'タスクスケジュールDBへ期限厳守タスクを登録しました ' + info);
              resolve(id);
            }
          );
        });
      } else{
        return new Promise((resolve, reject) => {
          XPBot.db.taskScdDB.run(
            'INSERT INTO tasks_resend(id, date, cmd, params, note, resend_by) VALUES($id, $date, $cmd, $params, $note, $resend_by)',
            {$id: id, $date: dateMoment, $cmd: cmd, $params: paramsJSON, $note: note, $resend_by: resend_by},
            function(err){
              if(err) {
                writeLogDB('ERR', 'タスクスケジュールDBへの遅延許可タスク登録に失敗しました ' + info);
                reject(err);
              }
              writeLogDB('Log', 'タスクスケジュールDBへ遅延許可タスクを登録しました ' + info);
              resolve(id);
            }
          );
        });
      }
    }
  };

  var _getTaskByIdFromResend = id =>{
    return new Promise((resolve, reject) => {
      XPBot.db.taskScdDB.serialize(function(){
        XPBot.db.taskScdDB.get(
          'SELECT * FROM tasks_resend where id = $id',
          {$id: id},
          function(err, res){
            if(err) reject(err);

            if(res){
              res.params = JSON.parse(res.params);
            }
            resolve(res);
          }
        );
      });
    });
  };

  var _getTaskByIdFromNoResend = id =>{
    return new Promise((resolve, reject) => {
      XPBot.db.taskScdDB.serialize(function(){
        XPBot.db.taskScdDB.get(
          'SELECT * FROM tasks_noresend where id = $id',
          {$id: id},
          function(err, res){
            if(err) reject(err);

            if(res){
              res.params = JSON.parse(res.params);
            }
            resolve(res);
          }
        );
      });
    });
  };

  XPBot.db.taskScdDB.getTaskById = async (id, tname) =>{
    if(tname == 'resend'){
      let res = await _getTaskByIdFromResend(id);
      return res;
    } else if(tname == 'noresend'){
      let res = await _getTaskByIdFromNoResend(id);
      return res;
    } else if(tname == 'all'){
      let res = await XPBot.db.taskScdDB.getTaskById(id, 'resend');

      if(res) return res;
      else return await XPBot.db.taskScdDB.getTaskById(id, 'noresend');
    } else{
      writeLogDB('ERR', '不正な引数 - tname: ' + tname);
      return;
    }
  };

  var _setStatusByIdFromResend = (id, status) =>{
    /*if(!_getTaskByIdFromResend(id)){
      console.error(id + 'はResendに存在しません');
      return;
    } else{*/
    return new Promise((resolve, reject) => {
      XPBot.db.taskScdDB.serialize(function(){
        XPBot.db.taskScdDB.run(
          "UPDATE tasks_resend SET status = $status where id = $id",
          {$status: status, $id: id},
          function(err){
            if(err) reject(err);
            resolve();
          }
        );
      });
    });
    //}
  };

  var _setStatusByIdFromNoResend = (id, status) =>{
    /*if(!_getTaskByIdFromNoResend(id)){
      console.error(id + 'はNoResendに存在しません');
      return;
    } else{*/
    return new Promise((resolve, reject) => {
      XPBot.db.taskScdDB.serialize(function(){
        XPBot.db.taskScdDB.run(
          "UPDATE tasks_noresend SET status = $status where id = $id",
          {$status: status, $id: id},
          function(err){
            if(err) reject(err);
            resolve();
          }
        );
      });
    });
    //}
  };

  XPBot.db.taskScdDB.setStatusById = async (id, status, tname) =>{
    let exist = await XPBot.db.taskScdDB.getTaskById(id, tname);
    if(!exist){
      writeLogDB('ERR', 'タスク(' + id + ')は' + tname + 'に存在しません');
      return;
    }
    
    if(tname == 'all'){
      if(typeof exist.resend_by !== 'undefined'){
        tname = 'resend';
      } else{
        tname = 'noresend';
      }
    }
    //console.log(tname);
    
    if(tname == 'resend'){
      let res = await _setStatusByIdFromResend(id, status);
      return res;
    } else if(tname == 'noresend'){
      let res = await _setStatusByIdFromNoResend(id, status);
      return res;
    } /*else if(tname == 'all'){
      let res = await XPBot.db.taskScdDB.setDoneTaskById(id, 'resend');

      if(res) return res;
      else return await XPBot.db.taskScdDB.setDoneTaskById(id, 'noresend');
    } */else{
      writeLogDB('ERR', '不正な引数 - tname: ' + tname);
      return;
    }
  };

  var _loadTaskByIdFromResend = async id =>{
    if(XPBot.scdTasks.has(id)){
      writeLog('ERR', '遅延許可タスク(' + id + ')は既に読み込まれています');
      return;
    } else{
      let task = await XPBot.db.taskScdDB.getTaskById(id, 'resend');// _getTaskByIdFromResend(id);
      /*if(!task){
        console.error(id + 'はResendに存在しません');
        return;
      }*/

      if(task.status == 'done'){
        writeLog('ERR', '遅延許可タスク(' + id + ')は実行済みです');
        return;
      }

      let dateMon = moment(task.date);
      let resendMon = dateMon.clone().add(task.resend_by, 's');
      let nowMon = moment();

      if(dateMon.isSameOrBefore(nowMon)){
        writeLog('ERR', '遅延許可タスク(' + id + ')は期限切れです');

        if(task.resend_by === 0 || resendMon.isAfter(nowMon)){
          
          /*XPBot.on(eventName, event.bind(null, XPBot));*/
          XPBot.on('ready', (async _XPBot => {
            await _XPBot.wait(1000);
            writeLog('Resent', '遅延許可タスク(' + id + ')を遅延実行しました');
            funcWrap({XPBot: _XPBot, taskId: id, cmdName: task.cmd, params: task.params, afterStat: 'resent'});
          }).bind(null, XPBot));
          
        }else{
          XPBot.db.taskScdDB.setStatusById(id, 'canceled', 'resend');
        }
        return;
      }

      let j = scd.scheduleJob(task.date, funcWrap.bind(null, {XPBot: XPBot, taskId: id, cmdName: task.cmd, params: task.params, afterStat: 'done'}));

      XPBot.scdTasks.set(id, j);
      
      let info = '(' + id + ')'
      
      writeLogDB('Log', 'タスクスケジュールDBへ遅延許可タスクを再登録しました ' + info);
    }
  };

  var _loadTaskByIdFromNoResend = async id =>{
    if(XPBot.scdTasks.has(id)){
      writeLog('ERR', '期限厳守タスク(' + id + ')は既に読み込まれています');
      return;
    } else{
      let task = await XPBot.db.taskScdDB.getTaskById(id, 'noresend');// _getTaskByIdFromResend(id);
      /*if(!task){
        console.error(id + 'はNoResendに存在しません');
        return;
      }*/

      if(task.status == 'done'){
        writeLog('ERR', '期限厳守タスク(' + id + ')は実行済みです');
        return;
      }

      let dateMon = moment(task.date);

      if(dateMon.isSameOrBefore(new moment())){
        writeLog('ERR', '期限厳守タスク(' + id + ')は期限切れです');
        XPBot.db.taskScdDB.setStatusById(id, 'canceled', 'noresend');
        return;
      }

      let j = scd.scheduleJob(task.date, funcWrap.bind(null, {XPBot: XPBot, taskId: id, cmdName: task.cmd, params: task.params, afterStat: 'done'}));

      XPBot.scdTasks.set(id, j);
      
      let info = '(' + id + ')'

      writeLogDB('Log', 'タスクスケジュールDBへ期限厳守タスクを再登録しました ' + info);
    }
  };

  XPBot.db.taskScdDB.loadTaskById = async (id, tname) => {
    let exist = await XPBot.db.taskScdDB.getTaskById(id, tname);
    if(!exist){
      writeLogDB('ERR', 'タスク(' + id + ')は' + tname + 'に存在しません')
      return;
    }

    if(tname == 'all'){
      if(typeof exist.resend_by !== 'undefined'){
        tname = 'resend';
      } else{
        tname = 'noresend';
      }
    }

    if(tname == 'resend'){
      let res = await _loadTaskByIdFromResend(id);
      return res;
    } else if(tname == 'noresend'){
      let res = await _loadTaskByIdFromNoResend(id);
      return res;
    } /*else if(tname == 'all'){
      let res = await XPBot.db.taskScdDB.loadTaskById(id, 'resend');

      if(res) return res;
      else return await XPBot.db.taskScdDB.loadTaskById(id, 'noresend');
    }*/ else{
      writeLogDB('ERR', '不正な引数 - tname: ' + tname);
      return;
    }

  };

  XPBot.db.taskScdDB.loadTasksNotYet = async () => {
    XPBot.db.taskScdDB.parallelize(function(){
      XPBot.db.taskScdDB.each(
        'SELECT id FROM tasks_resend where status IS NULL',
        {},
        function(err, res){
          if(err) console.error(err);

          console.log(res);
          XPBot.db.taskScdDB.loadTaskById(res.id, 'resend');
        }
      );

      XPBot.db.taskScdDB.each(
        'SELECT id FROM tasks_noresend where status IS NULL',
        {},
        function(err, res){
          if(err) console.error(err);

          console.log(res);
          XPBot.db.taskScdDB.loadTaskById(res.id, 'noresend');
        }
      );
    });
  };

  sqlite.initTB(
    XPBot, 
    XPBot.db.taskScdDB, 
    'tasks_resend', 
    '遅延許可タスクスケジュールテーブル',
    'id INTEGER PRIMARY KEY, date TEXT NOT NULL, cmd TEXT NOT NULL, params TEXT, note TEXT, resend_by INTEGER NOT NULL, status TEXT'
  );

  sqlite.initTB(
    XPBot, 
    XPBot.db.taskScdDB, 
    'tasks_noresend', 
    '期限厳守タスクスケジュールテーブル',
    'id INTEGER PRIMARY KEY, date TEXT NOT NULL, cmd TEXT NOT NULL, params TEXT, note TEXT, status TEXT'
  );

  const writeLog = (title, contents)=>{
    XPBot.log('Scd', contents, title);
  };
  const writeLogDB = (title, contents)=>{
    XPBot.log('ScdDB', contents, title);
  };
}