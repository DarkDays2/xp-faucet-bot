exports.run = async (XPBot, message, args, level) => { // eslint-disable-line no-unused-vars
  let vc = message.member.voiceChannel;
  
  if(vc){
    let listening = vc.members.filter(m => {
      return !m.deaf;
    });
    message.reply(listening.size+ '人が今 *' + vc.name + '* を聞いてるよ！');
    //console.log(listening.size, vc.members.size);
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
  category: "ラジオ",
  description: "自分が今いるボイスチャンネルの人数を表示します",
  usage: "vcnow"
};
