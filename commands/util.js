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
        XPBot.log('Util', `#${msg.channel.name}でのメッセージ送信を制限しました`, 'Log');
      },
      () => {
        XPBot.log('Util', `合計${args.length}チャンネルのメッセージ送信を制限しました`, 'Log');
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
        XPBot.log('Util', `#${msg.channel.name}でのメッセージ送信制限を解除しました`, 'Log');
      },
      () => {
        XPBot.log('Util', `合計${args.length}チャンネルのメッセージ送信制限を解除しました`, 'Log');
      },
      {waitBefore: 10, waitAfter: 0, permAfter: true}
    );
  } else if(subCmdName == 'stoptype'){
    let channelsToDo = message.guild.channels.filterArray((elem, index, array) => {
      return args.includes(elem.name);
    });
    //console.log(channelsToGo);

    Promise.all(
      channelsToDo.map((chnl) => {
        chnl.stopTyping();
        XPBot.log('Util', `#${chnl.name}でのタイピングを終了しました`, 'Log');
      })
    ).then(()=>{
      XPBot.log('Util', `合計${args.length}チャンネルでのタイピングを終了しました`, 'Log');
    });
  } else if(subCmdName == 'bal'){
    XPBot.getFrontendLogChannel(message.guild).send(',balance');
  } else if(subCmdName == 'del'){
    let channel = message.channel;
    channel.fetchMessage(args[0])
      .then(msg=> msg.delete())
      .then(e => message.delete());
    return;
  }
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
