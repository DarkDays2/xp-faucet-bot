//const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
var writeLog;

class chatFloodgate{
  // 現状allのみ対応可能
  constructor(XPBot, ctrlInfo/*, limitingInfo*/){  
    this._counter = {'all': 0};
    //this._counterUntilLimit = {'all': 0};
    this._ctrlInfo = ctrlInfo;
    //this._limitingInfo = limitingInfo;
    this._XPBot = XPBot;
    //this._checking = {'general': false};
    this._closed = {'all': false};
    //this._currentChecking = {'general': new Map()};
    this._lastSent = {'all': null};
    this._speed = {'all': 0};
  }
  
  get counter(){
    return this._counter;
  }
  
  get speed(){
    return this._speed;
  }
  
  notify(message, type){
    //console.log(Date.now());
    if(type == 'all'){
      if(this._ctrlInfo['all'].condCounterIncrement(message)){
        this._counter['all']++;
        
        if(this._counter['all'] >= this._ctrlInfo['all'].numCheck){
          if(this._lastSent['all'] === null){
            this._lastSent['all'] = Date.now();
            return;
          }
          
          let now = Date.now();
          let interval = now - this._lastSent['all'];
          
          if(interval == 0){
            this._closeLong(message);
          } else{
            let currentSpeed = (this._counter['all'] / (interval / 1000)) * 60;
            
            //this._XPBot.log('CFG', message.channel.name + ' の勢い: ' + currentSpeed.toFixed(4) + ' mes/min', 'Log');

            //console.log(message.channel.name, currentSpeed, interval / 1000, this._counter['all']);
            
            this._speed['all'] = currentSpeed;
            
            /*if(['register_room', 'bot-spam', 'bot-spam2', 'fiatbot_room'].includes(message.channel.name)){
              if(currentSpeed >= 80){
                this._closeLong(message);
              }
            } else{*/
              if(currentSpeed >= 150){
                this._close(message);
              }
            //}
            this._lastSent['all'] = now;
            this._counter['all'] = 0;
          }
        }
        
        if(this._ctrlInfo['all'].condCounterReset(message, this._counter['all'])){
          this._counter['all'] = 0;
        }
      }
    }
  }
  
  _close(message){
    
    let everyoneRole = message.guild.roles.find('name', '@everyone');
    let cnl = message.channel;
    
    let infStr = cnl.name + ' (' + this.speed['all'].toFixed(3) + ' mes/min)';
    
    this._XPBot.log('CFG', 'チャット制限開始: ' + infStr , 'Close');
    /*cnl.overwritePermissions(
      everyoneRole,
      {'SEND_MESSAGES': false},
      '勢い強杉'
    ).then(async () => {
      await this._XPBot.wait(4000);
      return cnl.overwritePermissions(
        everyoneRole,
        {'SEND_MESSAGES': true},
        '勢い強杉'
      );
    }).then(() => {
      this._XPBot.log('CFG', 'チャット制限終了: ' + cnl.name, 'Open');
    });*/
    
    //console.log(message.guild.name);
    let logCnl = this._XPBot.getFrontendLogChannel(message.guild);
    if(logCnl){
      //logCnl.send('チャット :no_entry: ' + infStr);
      logCnl.send('CFGInfo: ' + infStr);
    }
  }
  
  _closeLong(message){
    let everyoneRole = message.guild.roles.find('name', '@everyone');
    let cnl = message.channel;

    let infStr = cnl.name + ' (' + this.speed['all'].toFixed(3) + ' mes/min)';

    this._XPBot.log('CFG', 'チャット制限開始: ' + infStr , 'Close Long');
    cnl.overwritePermissions(
      everyoneRole,
      {'SEND_MESSAGES': false},
      '勢い強杉'
    ).then(async () => {
      await this._XPBot.wait(15000);
      return cnl.overwritePermissions(
        everyoneRole,
        {'SEND_MESSAGES': true},
        '勢い強杉'
      );
    }).then(() => {
      this._XPBot.log('CFG', 'チャット制限終了: ' + cnl.name, 'Open');
    });

    //console.log(message.guild.name);
    let logCnl = this._XPBot.getFrontendLogChannel(message.guild);
    if(logCnl){
      logCnl.send('チャット制限 :no_entry: ' + infStr);
    }
  }
}

module.exports = function(XPBot, ctrlInfo, limitingInfo){
  writeLog = (title, contents)=>{
    XPBot.log('CFG', contents, title);
  };
  
  return new chatFloodgate(XPBot, ctrlInfo/*, limitingInfo*/);
}