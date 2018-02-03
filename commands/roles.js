exports.run = async (XPBot, message, args, level) => { // eslint-disable-line no-unused-vars
  let roles = message.guild.roles;
  
  let disallow = ['@everyone', 'BOT', 'BOT-powerful', 'XPFaucet-Bot', '.Lex', 'BOT-private', 'BOT-public', 'BOT-default'];
  
  roles.map(async r => {
    if(disallow.includes(r.name)) return;
    let msg = `== ${r.name} ==\r\n`;
    r.members.map(m => {
      msg += `| @${m.displayName} |\r\n`;
    });
    await message.channel.send(msg, {code: true});
    await XPBot.wait(500);
    //console.log(r.name);
  });
  message.channel.send(`全役職: ${roles.size}個 - 表示: ${roles.size - disallow.length}個 - 除外: ${disallow.length}個`)
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
