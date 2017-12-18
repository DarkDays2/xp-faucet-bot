exports.run = async (XPBot, message, args, level) => {
  const friendly = XPBot.config.permLevels.find(l => l.level === level).name;
  message.reply(`あなたの権限レベル: ${level} - ${friendly}`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "一般利用者"
};

exports.help = {
  name: "mylevel",
  category: "その他",
  description: "この場所でのあなたの権限レベルを表示します。",
  usage: "mylevel"
};
