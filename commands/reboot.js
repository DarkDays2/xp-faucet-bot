exports.run = async (XPBot, message, args, level) => {// eslint-disable-line no-unused-vars
  XPBot.ready = false;
  
  await XPBot.wait(100);
  
  let msgDie = await message.reply("XPFaucetBotは再起動しています");
  
  /*XPBot.commands.forEach( async cmd => {
    await XPBot.unloadCommand(cmd);
  });
  await XPBot.db.walletDB.closeFromDB()
    //.then(()=> message.reply("XPFaucetBotはシャットダウンしました"))
    .then(()=> msgDie.delete())
    .then(()=> XPBot.user.setStatus("invisible"));
  process.exit(1);*/
  
  
  XPBot.commands.forEach(async cmd => {
    await XPBot.unloadCommand(cmd);
  });

  /*XPBot.db.forEach(async db =>{
    await db.closeFromDB();
  });*/

  for(dbName in XPBot.db){
    await XPBot.db[dbName].closeFromDB();
  }
  
  msgDie.delete()
    .then(()=> {
    XPBot.user.setStatus("invisible");
    
    process.exit(1);
  });
  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "水道局幹部"
};

exports.help = {
  name: "reboot",
  category: "システム",
  description: "Botをシャットダウンします。PM2下では自動的に再起動します。",
  usage: "reboot"
};
