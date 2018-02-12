/*
Helpコマンドはコマンド名と説明を表示するためのものです。
コマンドの使用権限がない場合は表示されません。
引数にコマンド名を渡すと詳しい説明を表示します。
*/

exports.run = (XPBot, message, args, level) => {
  // 引数無しの場合、全てのコマンドを一覧表示する
  if(!args[0]) {
    // サーバーごとの設定読み込み
    const settings = XPBot.getGuildSettings(message.guild);
    //const settings = message.guild ? XPBot.settings.get(message.guild.id) : XPBot.config.defaultSettings;

    // <Collection>.filter()関数で権限レベルでコマンドをフィルター
    const myCommands = message.guild ? XPBot.commands.filter(cmd => XPBot.levelCache[cmd.conf.permLevel] <= level) : XPBot.commands.filter(cmd => XPBot.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);

    // 出力の整形のために最長コマンド名のみ抽出する
    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = "";
    let output = `= XPFaucetBot コマンド一覧 =\n\n[${settings.prefix}help <コマンド名> で詳細表示]\n`;
    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    sorted.forEach( c => {
      const cat = c.help.category.toProperCase();
      if(currentCategory !== cat) {
        output += `\u200b\n== ${cat} ==\n`;
        currentCategory = cat;
      }
      output += `${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    message.channel.send(output, {code: "asciidoc", split: { char: "\u200b" }});
  } else {
    // 個別のコマンドの詳細表示
    let command = args[0];
    if(XPBot.commands.has(command)) {
      command = XPBot.commands.get(command);
      if(level < XPBot.levelCache[command.conf.permLevel]) return;
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\n\n使用法　　:: ${command.help.usage}\n\nエイリアス:: ${command.conf.aliases.join(", ")}\n= ${command.help.name} =`, {code:"asciidoc"});
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: "一般利用者"
};

exports.help = {
  name: "help",
  category: "全般",
  description: "権限レベルに合わせて使用可能なコマンドを全て表示します",
  usage: "help [コマンド名]"
};
