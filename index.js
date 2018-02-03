// Nodeバージョン確認
if(process.version.slice(1).split(".")[0] < 8) throw new Error("バージョン8.0.0以上のNodeが必要です。アップデートしてください。");

const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const moment = require("moment");
require("moment-duration-format");

const XPBot = new Discord.Client({messageCacheLifetime: 21600, messageSweepInterval: 3600});

// 起動完了判定の初期化
XPBot.ready = false;
XPBot.MainBotReady = null;

// 設定ファイル読み込み
XPBot.config = require("./config.js");

// 内部処理用関数読み込み
require("./modules/functions.js")(XPBot);
require("./modules/balanceDB.js")(XPBot);
require("./modules/scheduler.js")(XPBot);
require("./modules/emojis.js")(XPBot);

// タスクスケジューラー読み込み
XPBot.db.taskScdDB.loadTasksNotYet();

// エイリアス・コマンドを格納
XPBot.commands = new Enmap();
XPBot.aliases = new Enmap();

// Evie氏によるawesome Enhanced Mapモジュール
XPBot.settings = new Enmap({provider: new EnmapLevel({name: "settings"})});

const init = async () => {

  // コマンドをコレクションとしてメモリに読み込む
  const cmdFiles = await readdir("./commands/");
  XPBot.log("log", `合計${cmdFiles.length}個のコマンドを読み込んでいます。`);
  cmdFiles.forEach(f => {
    if(!f.endsWith(".js")) return;
    const response = XPBot.loadCommand(f);
    if(response) console.log(response);
  });

  // イベントを読み込む（メッセージイベント・準備完了イベントなど）
  const evtFiles = await readdir("./events/");
  XPBot.log("log", `合計${evtFiles.length}個のイベントを読み込んでいます。`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    // This line is awesome by the way. Just sayin'.
    XPBot.on(eventName, event.bind(null, XPBot));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  // 権限のキャッシュを生成
  XPBot.levelCache = {};
  for (let i = 0; i < XPBot.config.permLevels.length; i++) {
    const thisLevel = XPBot.config.permLevels[i];
    XPBot.levelCache[thisLevel.name] = thisLevel.level;
  }
  
  XPBot.limitBotSpam = false;
  
  // 本家Bot遅延監視
  let wi = {
    'general': {
      condCounterIncrement: (msg) => {
        const MainBotPrefix = ',';
        const args = msg.content.slice(MainBotPrefix.length).split(/ +/g);
        const command = args.shift().toLowerCase();
        const MainBotCommands = ['tip'];
        
        if(command == 'tip'){
          let regTip = /,tip\u0020(?:<@!?\d+>|X\w+)\u0020\d+(?:\.\d*)?(?=\u0020)?/;
          let regInfo = regTip.exec(msg.content);
          //console.log('Tip', regInfo != null);
          return regInfo != null;
        }
        
        return MainBotCommands.includes(command);
      },
      condCounterReset: (msg, current) => {
        return false; 
      }, 
      numCheck: 5
    }
  };
  
  let li = {
    'general': {
      execute: (XPBot, msg) => {
        if(XPBot.limitBotSpam) {
          XPBot.log('BW', '既に制限中', 'WAR');
          return;
        }
        
        //XPBot.limitBotSpam = true;
        
        //console.log('execute!');
        //XPBot.getFrontendLogChannel().send('');
        let settings = XPBot.getGuildSettings(msg.guild);
        let botOwner = XPBot.config.ownerID;
        let mod = msg.guild.roles.find('name', settings.modRole);
        //XPBot.getFrontendLogChannel(msg.guild).send(`<@&${mod.id}> 遅延が15分を超えました。`);
        XPBot.getFrontendLogChannel(msg.guild).send(`<@${botOwner}> 遅延が15分を超えました。`);
        
        let endTime = moment().second(0).add(8, 'm').format('HH[時]mm[分]');
        let limitMsg = ':lock: 本家Botの遅延時間が大きくなったため、\r\nこのチャンネルへのメッセージ送信を制限しています。\r\n\r\n' + 
            '解除予定時刻: ' + endTime + 'ごろ';
        
        const sendSpam = require('./modules/sendSpam.js');
        /*sendSpam(
          XPBot,
          msg.guild,
          ['bot-spam', 'bot-spam2'],
          limitMsg,
          null, //sendOption
          null, //funcAfterEach
          () => { //funcAfterAll
            XPBot.limitBotSpam = false;
            XPBot.log('BW', '制限終了', 'Log');
          },
          {waitBefore: 500, waitAfter: 8 * 60 * 1000}
        );*/
        
      }
    }
  };
  
  XPBot.botWatcher = [];
  //XPBot.botWatcher['MainBot'] = require("./modules/botWatcher.js")(XPBot, wi, li);
  
  
  XPBot.floodgates = {};
  let cnlsForFloodgates = ['chat_1_xp', 'chat_2_jk', 'chat_3_honobono', 'chat_4_crypto', 'kids_room', 'xp_radio802', 'register_room', 'bot-spam', 'bot-spam2', 'fiatbot_room', 'make_it_storm'];
  
  cnlsForFloodgates.forEach(cnl => {
    let inf = {
      'all': {
        condCounterIncrement: (msg) => {
          return true;
        },
        condCounterReset: (msg, current) => {
          return false; 
        }, 
        numCheck: 10
      }
    };
    //XPBot.floodgates[cnl] = require("./modules/chatFloodgate.js")(XPBot, inf);
  })
  

  // ログイン
  XPBot.login(XPBot.config.token);

  // トップレベルasync/await関数の終了
};

init();
