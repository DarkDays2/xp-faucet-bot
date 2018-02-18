exports.run = async (XPBot, message, args, level) => { // eslint-disable-line no-unused-vars
  message.delete();
  message.channel.send('うたげ棒企画の発案者は実はumai\n「胸がきゅっとなります」\nチョコレートの話は甘くて苦いマーマレードみたいですね')
    .then(m => m.delete(15000))
    .catch(e => {
    if(e.code === 10008) XPBot.log('Utage', 'メッセージは既に削除されています: ' + e.path, 'ERR');
    else console.error(e);
  });
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['うたげ', 'ウタゲ'],
  permLevel: "一般利用者"
};

exports.help = {
  name: "utage",
  category: "ネタ",
  description: "utage (2月17日現在)",
  usage: "utage"
};
