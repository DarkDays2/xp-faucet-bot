const sendSpam = require('../modules/sendSpam.js');
exports.run = async (XPBot, message, args, level) => {// eslint-disable-line no-unused-vars
  
  let subCmdName = args.shift();
  
  if(subCmdName == 'lockcnl'){
    sendSpam(
      XPBot,
      message.guild,
      args, // args[1] - args[n]
      ':lock: ただいま、メッセージの送信を制限しています。',
      null,
      msg => {
        XPBot.log('Util', `#${msg.channel.name}でのメッセージ送信を制限しました`, 'Log')
      },
      () => {
        XPBot.log('Util', `合計${args.length}チャンネルのメッセージ送信を制限しました`, 'Log')
      },
      {waitBefore: 10, waitAfter: 0, permAfter: false}
    );
  } else if(subCmdName == 'unlockcnl'){
    sendSpam(
      XPBot,
      message.guild,
      args, // args[1] - args[n]
      ':unlock: メッセージ送信を制限を解除しました。',
      null,
      msg => {
        XPBot.log('Util', `#${msg.channel.name}でのメッセージ送信制限を解除しました`, 'Log')
      },
      () => {
        XPBot.log('Util', `合計${args.length}チャンネルのメッセージ送信制限を解除しました`, 'Log')
      },
      {waitBefore: 10, waitAfter: 0, permAfter: false}
    );
  }
  //console.error('asdfasdf');
  //message.channel.stopTyping();
  //message.reply('@MaySoMusician');
  /*let settings = message.guild ? XPBot.settings.get(message.guild.id) : XPBot.config.defaultSettings;
  console.log(settings.modRole);
  let mod = message.guild.roles.find('name', settings.modRole);
  console.log(mod.name);
  message.channel.send(`<@&${mod.id}> test`);*/

  let sendSpam = require('../modules/sendSpam.js');
  sendSpam(
    XPBot,
    message.guild,
    ['bot-spam', 'bot-spam2'],
    ':unlock: コマンド制限を解除しました',
    null,
    msg => {
      console.log(msg.channel.name);
    },
    ()=>{
      console.log('done');
    },
    {waitBefore: 500, waitAfter: 0}
  );
  return;
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "水道局長"
};

exports.help = {
  name: "util",
  category: "サーバー運営",
  description: "lockcnl / unlockcnl: 書き込み制限/解除(先頭に「#」無し/空白でつなげる)",
  usage: "util <サブコマンド名> <サブコマンド引数>"
};
