const sendSpam = require('../modules/sendSpam.js');
exports.run = async (XPBot, message, args, level) => { // eslint-disable-line no-unused-vars
  let guild = message.guild;
  
  var channels;
  if(args[0] == 'chatrooms') {
    args.shift();
    channels = ['chat_1_xp', 'chat_2_jk', 'chat_3_honobono', 'chat_4_markets', 'chat_5_gamers', 'chat_6_creator'];
  }
  else channels = args.shift().split(';');
  //var channels = args.shift().split(';'); //args[0]
  let wait = parseInt(args.shift(), 10); //args[1]
  
  if(args.length == 0) return;
  
  args[0] = args[0].replace('everyone', '@everyone');
  
  let spamMsg = args.join(' ');
  
  const settings = XPBot.getGuildSettings(message.guild);  
  
  if(spamMsg.indexOf(',') === 0){
    message.reply('`spam`コマンドで水道局にXp-Botコマンドを打たせることはできません :cop:');
    return;
  }
  
  if(isNaN(wait)){
    message.reply(':no_entry_sign: 構文エラー');
    return;
  }
  
  let wBefore;
  if(wait >= 3000) wBefore = 2000;
  else if(wait > 0) wBefore = 800;
  else wBefore = 0;
  
  sendSpam(
    XPBot,
    guild,
    channels,
    spamMsg,
    null, //sendOption
    null, //funcAfterEach
    () => { //funcAfterAll
      XPBot.log('SPAM', '送信終了', 'Log');
    },
    {waitBefore: wBefore, waitAfter: wait}
  );
  
  /*console.log('channels: ', channels);
  console.log('wait: ', wait);
  console.log('spamMsg: ', spamMsg);*/

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "サポートチーム"
};

exports.help = {
  name: "spam",
  category: "サーバー運営",
  description: "指定されたチャンネルに一斉にメッセージを送信します\nチャンネル名に「chatrooms」を指定すると、全チャットルームに送信\nメッセージ文頭に「everyone」を入力すると、自動的に@everyoneメンションに変わる",
  usage: "spam <チャンネル名(空白無し/先頭に「#」無し/「;」でつなげる)> <送信後書き込み停止時間(ミリ秒)> <メッセージ>"
};
