const { inspect } = require("util");

// This command is to modify/edit guild configuration. Perm Level 3 for admins
// and owners only. Used for changing prefixes and role names and such.

// Note that there's no "checks" in this basic version - no config "types" like
// Role, String, Int, etc... It's basic, to be extended with your deft hands!

// Note the **destructuring** here. instead of `args` we have :
// [action, key, ...value]
// This gives us the equivalent of either:
// const action = args[0]; const key = args[1]; const value = args.slice(2);
// OR the same as:
// const [action, key, ...value] = args;
exports.run = async (XPBot, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

  // Retrieve current guild settings
  const settings = XPBot.settings.get(message.guild.id);
  
  // First, if a user does `-set add <key> <new value>`, let's add it
  if(action === "add") {
    if(!key) return message.reply("登録するキー名を指定してください");
    if(settings[key]) return message.reply("指定されたキーは既に使用されています");
    if(value.length < 1) return message.reply("キーに登録する値を指定してください");

    // `value` being an array, we need to join it first.
    settings[key] = value.join(" ");
  
    // One the settings is modified, we write it back to the collection
    XPBot.settings.set(message.guild.id, settings);
    message.reply(`${key} キーに ${value.join(" ")} を登録しました`);
  } else
  
  // Secondly, if a user does `-set edit <key> <new value>`, let's change it
  if(action === "edit") {
    if(!key) return message.reply("値を変更するするキー名を指定してください");
    if(!settings[key]) return message.reply("指定されたキーは存在しません");
    if(value.length < 1) return message.reply("新しい値を指定してください");
  
    settings[key] = value.join(" ");

    XPBot.settings.set(message.guild.id, settings);
    message.reply(`${key} キーの値を ${value.join(" ")} に変更しました`);
  } else
  
  // Thirdly, if a user does `-set del <key>`, let's ask the user if they're sure...
  if(action === "del") {
    if(!key) return message.reply("削除するキー名を指定してください");
    if(!settings[key]) return message.reply("指定されたキーは存在しません");
    
    // Throw the 'are you sure?' text at them.
    const response = await XPBot.awaitReply(message, `${key} キーを本当に削除しますか？ 削除は__**取り消せません**__`);
    console.log(response);
    // If they respond with y or yes, continue.
    if(["y", "yes"].includes(response)) {

      // We delete the `key` here.
      delete settings[key];
      XPBot.settings.set(message.guild.id, settings);
      message.reply(`${key} キーを削除しました`);
    } else
    // If they respond with n or no, we inform them that the action has been cancelled.
    if(["n","no","cancel"].includes(response)) {
      message.reply("削除を中止しました");
    }
  } else
  
  if(action === "get") {
    if(!key) return message.reply("値を取得するキー名を指定してください");
    if(!settings[key]) return message.reply("指定されたキーは存在しません");
    message.reply(`${key} キーの値は ${settings[key]}`);
  } else {
    message.channel.send(inspect(settings), {code: "json"});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["setting", "settings", "conf"],
  permLevel: "管理者"
};

exports.help = {
  name: "set",
  category: "システム",
  description: "このサーバー用の設定を表示・変更します。",
  usage: "set <add/edit/del/get> <キー名> <値>"
};
