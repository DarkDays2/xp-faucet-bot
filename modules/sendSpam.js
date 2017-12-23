const Discord = require("discord.js");
//var sqlite3 = require('sqlite3');

module.exports.spamWithTempLock = function(XPBot, guild, channels, message, sendOption, funcAfterEach, funcAfterAll, spamOption) {
  let channelsToSpam = guild.channels.filterArray((elem, index, array) => {
    return channels.includes(elem.name);
  });
  
  let everyoneRole = guild.roles.find('name', '@everyone');

  //console.log(channelsToGo);

  Promise.all(
    channelsToSpam.map((chnl) => {
      chnl.startTyping();
      return chnl.overwritePermissions(
        everyoneRole,
        {'SEND_MESSAGES': false}
      ).then(async ()=>{
        await XPBot.wait(spamOption.waitBefore || 0);
        return chnl.send(message, sendOption);
      }).then(async msg => {
        await XPBot.wait(spamOption.waitAfter || 0);
        return chnl.overwritePermissions(
          everyoneRole,
          {'SEND_MESSAGES': true}
        ).then(() => msg);
      }).then(msg=>{
        chnl.stopTyping();
        if(funcAfterEach) funcAfterEach(msg);
      })
    })
  ).then(()=>{
    if(funcAfterAll) funcAfterAll();
  });
  
  const writeLog = (title, contents)=>{
    XPBot.log('SPAM', contents, title);
  };
};