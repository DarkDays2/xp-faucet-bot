const moment = require("moment");
module.exports = (XPBot) => {

  /*
  PERMISSION LEVEL FUNCTION

  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!

  */
  XPBot.permlevel = message => {
    let permlvl = 0;

    const permOrder = XPBot.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if(message.guild && currentLevel.guildOnly) continue;
      if(currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };


  /*
  LOGGING FUNCTION

  Logs to console. Future patches may include time+colors
  */
  XPBot.log = (type, msg, title) => {
    let now = moment().format('YYYY-MM-DD HH:mm:ss.SS');
    if(!title) title = "Log";
    let strCOut = `[${now}][${type}] [${title}]${msg}`;
    let strLS = `[${now}] Type: ${type}\n` + '```' + `Title: ${title}\nContents: ${msg}` + '```';
    let ls = XPBot.getLogServer();

    if(title == 'ERR' || title == 'WAR') {
      console.error(strCOut);
      if(ls) ls.channels.find('name', 'output').send(':warning: ' + strLS);
    }
    else {
      console.log(strCOut);
      if(ls) ls.channels.find('name', 'output').send(':information_source: ' + strLS);
    }
  };

  XPBot.getFrontendLogChannel = (guild) => {
    const settings = guild ? XPBot.settings.get(guild.id) : XPBot.config.defaultSettings;
    let logChannel = guild.channels.find('name', settings.modLogChannel);
    return logChannel;
  };

  XPBot.getLogServer = () => {
    let s = XPBot.guilds.get(XPBot.config.logServer);
    if(!s || !s.available) return null;
    else return s;
  };

  XPBot.getGuildSettings = (guild) =>{
    return guild ? XPBot.settings.get(guild.id) : XPBot.config.defaultSettings;
  }

  XPBot.getRadioChatCnl = (vc) => {
    let pairs = {
      '374188134013075467': { //XP-JP
        'XP_radio802': 'xp_radio802',
        'freetalk': 'vc_freetalk',
        'developer_only': '',
        'ofuton': ''
      },
      '391108609460928521': { //Test
        'general2': 'general' //MaysoTest
      },
      '397787014130565130' :{ //プレミアム
        '会議室 - 01': ''
      }
    };

    if(vc.guild.id in pairs){
      if(vc.name in pairs[vc.guild.id]) return pairs[vc.guild.id][vc.name];
    }

  };

  /*
  SINGLE-LINE AWAITMESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...

  USAGE

  const response = await XPBot.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);

  */
  XPBot.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m=>m.author.id == msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };


  /*
  MESSAGE CLEAN FUNCTION

  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  XPBot.clean = async (XPBot, text) => {
    if(text && text.constructor.name == "Promise")
      text = await text;
    if(typeof text !== "string")
      text = require("util").inspect(text, {depth: 0});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(XPBot.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };

  XPBot.safenUsername = async (XPBot, text) => {
    if(text && text.constructor.name == "Promise")
      text = await text;
    if(typeof text !== "string")
      text = require("util").inspect(text, {depth: 0});

    text = text
      .replace(/\*/g, "\\*")
      .replace(/_/g, "\\_")
      .replace(/~/g, "\\~")
      .replace(/`/g, "\\`");

    return text;
  };

  XPBot.loadCommand = (commandName) => {
    try {
      const props = require(`../commands/${commandName}`);
      XPBot.log("log", `コマンド読込: ${props.help.name}`);
      if(props.init) {
        props.init(XPBot);
      }
      XPBot.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        XPBot.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `${commandName}コマンド読込失敗: ${e}`;
    }
  };

  XPBot.unloadCommand = async (commandName) => {
    let command;
    if(XPBot.commands.has(commandName)) {
      command = XPBot.commands.get(commandName);
    } else if(XPBot.aliases.has(commandName)) {
      command = XPBot.commands.get(XPBot.aliases.get(commandName));
    }
    if(!command) return `\`${commandName}\`コマンドは存在せず、エイリアスでもありません。もう一度お試しください。`;

    if(command.shutdown) {
      await command.shutdown(XPBot);
    }
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    return false;
  };

  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */

  // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
  // later, this conflicts with native code. Also, if some other lib you use does
  // this, a conflict also occurs. KNOWING THIS however, the following 2 methods
  // are, we feel, very useful in code. 

  // <String>.toPropercase() returns a proper-cased string such as: 
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };    

  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)]
  };

  // `await XPBot.wait(1000);` to "pause" for 1 second.
  XPBot.wait = require("util").promisify(setTimeout);

  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("捕捉されなかった例外: ", errorMsg);
    // Always best practice to let the code crash on uncaught exceptions. 
    // Because you should be catching them anyway.
    let ls = XPBot.getLogServer();
    if(ls) ls.channels.find('name', 'output').send(`<@${XPBot.config.ownerID}> ` + ':no_entry: 補足されなかった例外:\n```' + errorMsg + '```');
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    console.error("捕捉されなかったPromiseのエラー: ", err);
    let ls = XPBot.getLogServer();
    if(ls) ls.channels.find('name', 'output').send(`<@${XPBot.config.ownerID}> ` + ':no_entry: 捕捉されなかったPromiseのエラー:\n```' + err + '```');
  });
};
