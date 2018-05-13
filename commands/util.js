//const sendSpam = require('../modules/sendSpam.js');
exports.run = async (XPBot, message, args, level) => {// eslint-disable-line no-unused-vars

  let subCmdName = args.shift();
  
  if(subCmdName == 'vcin'){
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join().catch(e => console.error(e));
    }
  } else if(subCmdName == 'vcout'){
    if (message.member.voiceChannel) {
      message.member.voiceChannel.leave();
    }
  } else if(subCmdName == 'radio_jg'){
    if(args[0] == 'start' && args[1] != ''){
      if (message.member.voiceChannel) {
        message.member.voiceChannel.join()
          .then(async connection => {
          await XPBot.wait(1000);
          XPBot.testDispatcher01 = connection.playFile("./assets/" + args[1] + ".mp3");
        }).catch(console.log);
      }
    } else{
      if(XPBot.testDispatcher01){
        XPBot.testDispatcher01.end();
        XPBot.testDispatcher01 = null;
      }
      message.member.voiceChannel.leave();
    }
  } else if(subCmdName == 'help'){
    let output = 
        'vcin      :: 自分が参加しているボイスチャットに参加します。\r\n' + 
        'vcout     :: 自分が参加しているボイスチャットから退出します。\r\n' + 
        'radio\_jg  :: ジングル・BGMを流します。\r\n' + 
        'help      :: このヘルプを表示します。\r\n';
    message.channel.send(output, {code: "asciidoc", split: { char: "\u200b" }});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "モデレーター"
};

exports.help = {
  name: "util",
  category: "サーバー運営",
  description: "便利なコマンドを実行します。「util help」で詳細。",
  //description: "lockcnl / unlockcnl: 書き込み制限/解除(先頭に「#」無し/空白でつなげる)",
  usage: "util <サブコマンド名> <サブコマンド引数>"
};
