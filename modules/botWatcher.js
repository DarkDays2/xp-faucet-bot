//const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
var writeLog;

class BotWatcher{
  // 現状generalのみ対応可能
  constructor(XPBot, watcherInfo, limitingInfo){  
    this._counter = {'general': 0};
    this._counterUntilLimit = {'general': 0};
    this._watcherInfo = watcherInfo;
    this._limitingInfo = limitingInfo;
    this._XPBot = XPBot;
    this._checking = {'general': false};
    this._limiting = {'general': false};
    this._currentChecking = {'general': new Map()};
  }
  
  get counter(){
    return this._counter;
  }
  
  notifyCommand(message, cmdName){
    if(this._watcherInfo['general'].condCounterIncrement(message)){
      this._counter['general']++;
      this._counterUntilLimit['general']++;
      
      if(this._counter['general'] >= this._watcherInfo['general'].numCheck){
        if(this._currentChecking['general'].has(message.author.id)){
          writeLog('Next User', '次のユーザーへ');
          //console.log('指定されたユーザーは追跡済みなので次のユーザーへ');
        } else{
          //console.log('check start');
          this._checking['general'] = true;
          this._currentChecking['general'].set(
            message.author.id,
            {sentMsg: message, cmdName: cmdName}
          );
          writeLog('Start Wacthing', message.author.username + '('+ message.author.id + ')');
          //console.log('ユーザー追跡: ' + message.author.username + '('+ message.author.id + ')/ ' + message.createdAt);
          message.react(this._XPBot.emojisByName['stopwatch']);
          this._counter['general'] = 0;
        }
        
        /*this._watcherInfo['general'].funcCheck(this._XPBot, message)
          .then(result => {
          if(result) this._limitingInfo['general'].execute(this._XPBot, message);
          //console.log('check end');
          this._checking['general'] = false;
        });*/
        //this._counter['general'] = 0;
      }
    }
    
    if(this._watcherInfo['general'].condCounterReset(message, this._counter['general'])){
      this._counter['general'] = 0;
      this._counterUntilLimit['general'] = 0;
    }
  }
  
  notifyResponse(message, userID, cmdName){
    if(!this._currentChecking['general'].has(userID)){
      //console.error('checking error: 指定されたユーザーは追跡されていない');
      return;
    }
    
    let sentData = this._currentChecking['general'].get(userID);
    let sentMsg = sentData.sentMsg;
    //let sentAt = sentData.sentAt;
    let sentCmd = sentData.cmdName;
    
    if(sentCmd !== cmdName){
      writeLog('ERR', 'コマンドが不一致');
      //console.error('checking error: 追跡されているがコマンドが不一致');
      return;
    }
    
    //let responseAt = message.createdAt;
    let duration = message.createdAt - sentMsg.createdAt;
    let durationStr = moment.duration(duration).format("D[日]H[時間]m[分]ss[秒]SS");
    /*console.log(duration);
    console.log(moment.duration(duration).format("D[日]H[時間]m[分]ss[秒]SS"));*/
    let logStr = '遅延 :stopwatch: ' + durationStr;
    writeLog('End Wacthing', durationStr);
    this._XPBot.getFrontendLogChannel(message.guild).send(logStr);
    
    if(duration >= 15 * 60 * 1000){
      this._limitingInfo['general'].execute(this._XPBot, message);
      this._counter['general'] = 0;
      this._counterUntilLimit['general'] = 0;
    }
    //console.log('check end');
  }
  
  
}

module.exports = function(XPBot, watcherInfo, limitingInfo){
  writeLog = (title, contents)=>{
    XPBot.log('BW', contents, title);
  };
  
  return new BotWatcher(XPBot, watcherInfo, limitingInfo);
}