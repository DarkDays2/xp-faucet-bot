exports.run = async (XPBot, message, args, level) => { // eslint-disable-line no-unused-vars
  const msg = await message.channel.send("ピン？");
  msg.edit(`ポン！ 遅延は${msg.createdTimestamp - message.createdTimestamp}ミリ秒。API遅延は${Math.round(XPBot.ping)}ミリ秒`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "一般利用者"
};

exports.help = {
  name: "ping",
  category: "その他",
  description: "ピンポンのようでピンポンでないピンポン。遅延を取得します。",
  usage: "ping"
};
