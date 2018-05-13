exports.run = async (XPBot, message, args, level) => { // eslint-disable-line no-unused-vars
  /*message.reply('XPJPWalletのコマンドは `!xp` です。よく確認してもう一度お試しください。')
  .then(async msg => {
    await XPBot.wait(20000);
    msg.delete();
  });*/
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "一般利用者"
};

exports.help = {
  name: "xp",
  category: "利用不可",
  description: "利用不可",
  usage: "xp"
};
