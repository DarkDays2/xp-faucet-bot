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
      ':unlock: メッセージ送信の制限を解除しました。',
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
  } else if(subCmdName == 'reg'){
    //dockeXPBot.getFrontendLogChannel(message.guild).send(',register');
  } else if(subCmdName == 'bal'){
    XPBot.getFrontendLogChannel(message.guild).send(',balance');
  } else if(subCmdName == 'del'){
    let channel = message.channel;

    message.delete()
      .then(()=>{
      return Promise.all(
        args.map(msgId => {
          channel.fetchMessage(msgId)
            .then(msg => {
            msg.delete();
          }).catch(e=>{
            if(e.code === 10008) XPBot.log('Util', 'メッセージが見つかりません: ' + e.path, 'ERR');
            else console.error(e);
          });;
        })
      );
    });
  } else if(subCmdName == 'vcin'){
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
        'lockcnl   :: チャンネルの書込を制限します。(チャンネル名は先頭に「#」無し/空白でつなげる)\r\n' +
        'unlockcnl :: チャンネルの書込制限を解除します。(チャンネル名は先頭に「#」無し/空白でつなげる)\r\n' + 
        'stoptype  :: Botのチャンネルでのタイピングを終了します。(チャンネル名は先頭に「#」無し/空白でつなげる)\r\n' + 
        'bal       :: ,balanceを送信します\r\n' + 
        'del       :: メッセージを削除します。(メッセージIDを空白でつなげる)\r\n' + 
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
  permLevel: "ラボメンバー"
};

exports.help = {
  name: "util",
  category: "サーバー運営",
  description: "便利なコマンドを実行します。「util help」で詳細。",
  //description: "lockcnl / unlockcnl: 書き込み制限/解除(先頭に「#」無し/空白でつなげる)",
  usage: "util <サブコマンド名> <サブコマンド引数>"
};
