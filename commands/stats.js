const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = (XPBot, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = moment.duration(XPBot.uptime).format(" D [日], H [時間], m [分], s [秒]");
  message.channel.send(`= XPFaucetBot 統計 =
• メモリ使用量 :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• 稼働時間　　 :: ${duration}
• ユーザー数　 :: ${XPBot.users.size.toLocaleString()}
• サーバー数　 :: ${XPBot.guilds.size.toLocaleString()}
• チャンネル数 :: ${XPBot.channels.size.toLocaleString()}
• Discord.js  :: v${version}
• Node        :: ${process.version}`, {code: "asciidoc"});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "一般利用者"
};

exports.help = {
  name: "stats",
  category: "Miscelaneous",
  description: "Gives some useful bot statistics",
  usage: "stats"
};
