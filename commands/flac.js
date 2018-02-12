exports.run = async (XPBot, message, args, level) => { // eslint-disable-line no-unused-vars
  message.delete();
  let num = ('00' + args[0].toString()).slice(-2);
  
  require('../modules/radioSound.js')(XPBot);
  XPBot.radioCenter.ctrler.playFile({
    guild: message.guild,
    cnl: message.member.voiceChannel,
    fileName: 'flac' + num + '.mp3',
    opts: {vol: 0.2}
  });
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ふらっく', 'フラック', 'ふらぐ', 'フラグ'],
  permLevel: "水道局長"
};

exports.help = {
  name: "flac",
  category: "ネタ",
  description: "flacさん玉音放送 (IDは01・02・03)",
  usage: "flac <ID>"
};
