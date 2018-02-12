const Discord = require("discord.js");
const lotSys = require('../modules/lotterySystem.js');
//var sqlite3 = require('sqlite3');
var writeLog;

module.exports = function(XPBot, message) {
  writeLog = (title, contents) => {
    XPBot.log('Ainote', contents, title);
  };
  
  writeResult = (type, mes, res) => {
    writeLog(
      type,
      `出現: ${mes.channel.name}, 結果: ${res}`
    );
  }
  
  let cont = message.content;
  
  if(cont.includes('ワンチャン')){
    let res = lotSys(
      XPBot,
      [`<${XPBot.emojisByName['doge']}> ＜ ワンちゃん`],
      [0.3],
      null
    );
    if(res !== null) {
      message.channel.send(res);
      writeResult('犬1', message, res);
    }
  } else if(cont.includes('イーサ')){
    let res = lotSys(
      XPBot,
      ['イーサが良いさ', '~~イーサが良いさ~~'],
      [0.05, 0.05],
      null
    );
    if(res !== null) {
      message.channel.send(res);
      writeResult('ETH', message, res);
    } 
  } else if(cont.includes('イークラ')){
    let res = lotSys(
      XPBot,
      ['イークラで良い暮らし！', '~~イークラで良い暮らし！~~'],
      [0.05, 0.05],
      null
    );
    
    if(res !== null) {
      message.channel.send(res);
      writeResult('ETC', message, res);
    }
  } else if(cont.includes('ドージ') || cont.includes('DOGE') || cont.includes('doge') || cont.includes('Doge')){
    let res = lotSys(
      XPBot,
      [`<${XPBot.emojisByName['doge']}> ＜ ワイは動じないで`, `<${XPBot.emojisByName['doge']}> ＜ ワイはDOGEないで`, `<${XPBot.emojisByName['doge']}> ＜ ところで、ワイでドッグフードが買えるらしいんだが`],
      [0.08, 0.08, 0.05],
      null
    );
    if(res !== null) {
      message.channel.send(res);
      writeResult('犬2', message, res);
    }
  }
  
};