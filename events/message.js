// Messageイベントはメッセージを受信した全てのタイミングで発火します。
// 注: Botは全てのイベントに関連付けられているため、関数実行時全てのイベントに
// XPBot, other, args が渡されます。

module.exports = (XPBot, message) => {
  //if(message.author.bot) return;
  if(message.author.id === XPBot.user.id) return;

  if(message.author.bot){
    if(XPBot.config.mainBots.includes(message.author.id)){
      let regBalanceMsg = /<@(\d+)>,\sBalance:\s\d+(?:\.\d*)?(?:[eE][+-]?\d+)?\s-\s(X\w*)/;
      let regInfo = regBalanceMsg.exec(message.content);

      if(regInfo){
        let userID = regInfo[1]; // Balanceコマンドを実行したUserのID
        let userAddress = regInfo[2]; // Balanceコマンドで出力されたXPウォレットアドレス
        XPBot.db.walletDB.addAddress(userID, userAddress)
          .then(()=>{
          message.channel.send('DBに登録しました');
        })
          .catch((ex)=>{
          message.channel.send('DBに登録失敗');
        });
      }
    }

  } else{

    // PersistentCollectionからこのサーバー用の設定を取得
    // Guildが無い場合はデフォルト設定（DM用）
    const settings = message.guild
    ? XPBot.settings.get(message.guild.id)
    : XPBot.config.defaultSettings;

    // コマンド・関数内で使いやすいように、message.settingsに設定オブジェクトを関連付ける
    message.settings = settings;

    // プレフィックスで始まらないメッセージを無視
    if(message.content.indexOf(settings.prefix) !== 0) return;

    // コマンド名と引数を分離
    // 例: 「+say Is this the real life?」
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // ユーザーもしくはメンバーの権限を取得
    const level = XPBot.permlevel(message);

    // 指定されたコマンド名がコマンドもしくはエイリアスとして存在するか確認
    const cmd = XPBot.commands.get(command) || XPBot.commands.get(XPBot.aliases.get(command));
    // 「const 変数名 = 一方 OR 他方;」は、2つのうちどちらかから値を取得する方法としては見やすくて楽だね
    if(!cmd) return;

    // 一部のコマンドはDMでは使用できないので、それを確認。
    if(cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send("指定されたコマンドはDMでは使用できません。サーバー内でお試しください。");

    if(level < XPBot.levelCache[cmd.conf.permLevel]) {
      if(settings.systemNotice === "true") {
        return message.channel.send(`あなたは、指定されたコマンドを実行するのに必要な権限がありません。
あなたの権限レベル: ${level} (${XPBot.config.permLevels.find(l => l.level === level).name})
要求されている権限レベル: ${XPBot.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
      } else {
        return;
      }
    }

    // message引数の単純化のため、送信者の権限レベルをauthorオブジェクトに格納（メンバーではないのでDMでも使用可）
    // levelというコマンドモジュールの引数は将来的に非推奨になる可能性あり
    message.author.permLevel = level;

    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
    // コマンドが存在し且つユーザーが権限を持っているとき、コマンドを実行
    XPBot.log("log", `${XPBot.config.permLevels.find(l => l.level === level).name} の ${message.author.username}(${message.author.id}) が${cmd.help.name}コマンドを実行しました`, "CMD");
    cmd.run(XPBot, message, args, level);
  }
};
