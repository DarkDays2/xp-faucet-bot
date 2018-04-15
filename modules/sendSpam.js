const Discord = require("discord.js");
//var sqlite3 = require('sqlite3');
var writeLog;

var _sendSpam = function(XPBot, guild, channels, message, sendOption, funcAfterEach, funcAfterAll, spamOption) {
  let channelsToSpam = guild.channels.filterArray((elem, index, array) => {
    return channels.includes(elem.name);
  });

  let everyoneRole = guild.roles.find('name', '@everyone');

  let sendPermAfterSpam = typeof spamOption.permAfter !== "undefined" ? spamOption.permAfter : true,
      needPreMsg = typeof spamOption.sendPreMsg !== 'undefined' ? spamOption.sendPreMsg : spamOption.waitBefore >= 1000,
      needUnlockMsg = typeof spamOption.sendUnlockMsg !== 'undefined' ? spamOption.sendUnlockMsg : sendPermAfterSpam && spamOption.waitAfter >= 3000;

  Promise.all(
    channelsToSpam.map(chnl => {
      return new Promise(async (resolve, reject) => {
        chnl.startTyping();

        let preMsg = null;
        if(needPreMsg){
          preMsg = await chnl.send(
            'しばらくお待ちください\r\n:satellite: XP水道局がメッセージを受信しました\r\n:incoming_envelope: 転送しています'
          );
        }

        if(spamOption.waitBefore){
          await chnl.overwritePermissions(
            everyoneRole,
            {'SEND_MESSAGES': false}
          );
          await XPBot.wait(spamOption.waitBefore);
        }
        
        chnl.send(message, sendOption)
          .then(async mainMsg => {
          await XPBot.wait(spamOption.waitAfter || 0);

          chnl.overwritePermissions(
            everyoneRole,
            {'SEND_MESSAGES': sendPermAfterSpam}
          ).then(async () => {
            if(needUnlockMsg){
              let unlockMsg = await chnl.send(
                ':unlock: メッセージ書き込み制限を解除しました。'
              );
              unlockMsg.delete(10000);
            }
            if(funcAfterEach) funcAfterEach(mainMsg);
          });

          chnl.stopTyping();//別スレッドでタイピング停止
        });
        if(needPreMsg) preMsg.delete(2000); //別スレッドで削除
      });      
    })
  ).then(()=>{
    if(funcAfterAll) funcAfterAll();
  });

  writeLog = (title, contents)=>{
    XPBot.log('SPAM', contents, title);
  };
};

module.exports = _sendSpam;