// Nodeバージョン確認
if(process.version.slice(1).split(".")[0] < 8) throw new Error("バージョン8.0.0以上のNodeが必要です。アップデートしてください。");

const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

const XPBot = new Discord.Client();

// 起動完了判定の初期化
XPBot.ready = false;

// 設定ファイル読み込み
XPBot.config = require("./config.js");

// 内部処理用関数読み込み
require("./modules/functions.js")(XPBot);
require("./modules/balanceDB.js")(XPBot);

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
  
  // 本家Bot遅延監視
  let wi = {
    'general': {
      condCounterIncrement: (msg) => {
        const MainBotPrefix = ',';
        const args = msg.content.slice(MainBotPrefix.length).split(/ +/g);
        const command = args.shift().toLowerCase();
        const MainBotCommands = ['balance'];
        
        let res = MainBotCommands.includes(command);
        console.log(msg.content, res);
        return res;
      },
      condCounterReset: (msg, current) => {
        return false; 
      }, 
      numCheck: 20//, 
      /*funcCheck: (XPBot, msg) => {
        console.log('Check!');
      }*/
    }
  };
  
  let li = {
    'general': {
      execute: (XPBot, msg) => {
        console.log('execute!');
      }
    }
  };
  
  XPBot.botWatcher = [];
  XPBot.botWatcher['MainBot'] = require("./modules/botWatcher.js")(XPBot, wi, li);

  // ログイン
  XPBot.login(XPBot.config.token);
  
  // 起動完了
  XPBot.ready = true;

  // トップレベルasync/await関数の終了
};

init();
