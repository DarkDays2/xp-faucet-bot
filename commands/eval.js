// Evalコマンドは全てのJavaScriptコマンドの実行を可能にします。
// 権限レベル10のみ使用が許可されています。
// 危険ですがトラブルシューティング時の最終手段として有効です。

exports.run = async (XPBot, message, args, level) => { // eslint-disable-line no-unused-vars
  const code = args.join(" ");
  try {
    const evaled = eval(code);
    const clean = await XPBot.clean(XPBot, evaled);
    message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${await XPBot.clean(XPBot, err)}\n\`\`\``);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "水道局長"
};

exports.help = {
  name: "eval",
  category: "System",
  description: "任意のJavaScriptコードを実行します。.",
  usage: "eval [...code]"
};
