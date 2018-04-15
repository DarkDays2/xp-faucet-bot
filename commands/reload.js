exports.run = async (XPBot, message, args, level) => {// eslint-disable-line no-unused-vars
  if(!args || args.size < 1) return message.reply("再読み込みしたいコマンドを選んでね。");

  let response = await XPBot.unloadCommand(args[0]);
  if(response) return message.reply(`読込解除エラー: ${response}`);

  response = XPBot.loadCommand(args[0]);
  if(response) return message.reply(`読込エラー: ${response}`);

  message.reply(`\`${args[0]}\`コマンドは正常に再読み込みされました。`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "水道局幹部"
};

exports.help = {
  name: "reload",
  category: "システム",
  description: "修正したコマンドを再読み込みします。",
  usage: "reload [コマンド名]"
};
