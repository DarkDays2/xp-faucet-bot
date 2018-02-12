exports.run = async (XPBot, message, args, level) => { // eslint-disable-line no-unused-vars
  let onoff = args.shift();
  
  if(!onoff) return;
  
  if(onoff == 'on') XPBot.MainBotReady = true;
  else if(onoff == 'off') XPBot.MainBotReady = false;
  
  XPBot.log('WWWB', 'WWWalletBot\'s ready turned into: ' + XPBot.MainBotReady, 'Log');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "モデレーター"
};

exports.help = {
  name: "!wwwb",
  category: "システム",
  description: "開発用",
  usage: "!wwwb"
};
