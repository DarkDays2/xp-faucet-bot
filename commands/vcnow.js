exports.run = async (XPBot, message, args, level) => { // eslint-disable-line no-unused-vars
  let vc = message.member.voiceChannel;
  
  if(vc){
    let num = vc.members.size;
    message.reply(num + ' 人が今 ' + vc.name + ' を聞いてるよ！');
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ラジオ何人'],
  permLevel: "一般利用者"
};

exports.help = {
  name: "vcnow",
  category: "その他",
  description: "自分が今いるボイスチャンネルの人数を表示します",
  usage: "vcnow"
};
