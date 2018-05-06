exports.run = async (XPBot, message, args, level) => { // eslint-disable-line no-unused-vars
  let roles = message.guild.roles;
  
  //let disallow = ['@everyone', 'BOT', 'BOT-powerful', 'XPFaucet-Bot', '.Lex', 'BOT-private', 'BOT-public', 'BOT-default'];
  
  roles.map(r => {
    console.log(r.name, r.id);
  });
  //message.channel.send(`全役職: ${roles.size}個 - 表示: ${roles.size - disallow.length}個 - 除外: ${disallow.length}個`)
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "モデレーター"
};

exports.help = {
  name: "roles",
  category: "サーバー運営",
  description: "役職一覧",
  usage: "roles"
};
