// Messageイベントはメッセージを受信した全てのタイミングで発火します。
// 注: Botは全てのイベントに関連付けられているため、関数実行時全てのイベントに
// XPBot, other, args が渡されます。
const moment = require("moment");
require("moment-duration-format");

module.exports = (XPBot, message) => {
  if(!XPBot.ready) return;
  //if(message.author.bot) return;
  if(message.author.id === XPBot.user.id) return;

  let cnl = message.channel;
  if(XPBot.floodgates[cnl.name]){
    XPBot.floodgates[cnl.name].notify(message, 'all');
  }

  if(message.author.bot){ // 自分以外のBotが送信した場合
    if(message.author.id == XPBot.config.WWWalletBot){//Balance: 0.0000000 - Bot Balance: 29340.60848430918 - XDf24jHGNkK31taSL3PyNvh4bDh5pQ8PWh
      let balResPattern = /Balance:\s\d+(?:\.\d*)?\s(?:-\sBot\sBalance:\s\d+(?:\.\d*)?\s)?-\s(X\w*)/;
      let balResRegInfo = balResPattern.exec(message.content);

      if(balResRegInfo){
        //let userID = balResRegInfo[1]; // Balanceコマンドを実行したUserのID
        let userAddress = balResRegInfo[1]; // Balanceコマンドで出力されたXPウォレットアドレス

        let userField = message.embeds[0].fields.find((elem, index, arr) => {
          return elem.name === 'User:';
        });

        let userName = userField.value;

        //console.log(userName);
        if(!userName) return;

        if(!XPBot.config.allowedBalanceCnls.includes(message.channel.name)){
          message.delete()
            .then(msg => {
            console.log('[Deleted]', message.channel.name);
            //message.channel.send('`,balance`コマンドは <#375532870376357889> チャンネルでお使いください');
          }).message(e=>{
            if(e.code === 10008) /*空文*/ ;
            else console.error(e);
          });
        }

        (async () => {
          let fetchedUsers = await message.guild.fetchMembers(userName, 10);

          console.log('catched balance', userName);
          console.log(fetchedUsers.members.size);
        })();


        //console.log(userF.value);


        /*XPBot.db.walletDB.addAddress(userID, userAddress, 'Bot')
          .then(()=>{
          //message.channel.send('DBに登録しました');
        })
          .catch((ex)=>{
          message.channel.send('DBに登録失敗');
        });

        XPBot.botWatcher['MainBot'].notifyResponse(message, userID, 'balance');*/
        return;
      }

      if(message.embeds[0]){
        let msgAuthor = message.embeds[0].author.name;
        if(msgAuthor === 'Transaction Sent'){
          let userID = message.mentions.users.first().id;
          //XPBot.botWatcher['MainBot'].notifyResponse(message, userID, 'tip');
        }
      }

      let retryPattern = /<@!?(\d+)>,\stry\sagain\sin\s~?(\d+)\sseconds?/;
      let retryRegInfo = retryPattern.exec(message.content);
      if(retryRegInfo){
        let userID = retryRegInfo[1];
        let waitTime = retryRegInfo[2];
        message.channel.send(`<@${userID}> 連続してコマンドを使用することはできません。` + waitTime + '秒後にもう一度お試しください。');
        return;
      }

      let notRgstPattern = /<@!?(\d+)>,\sUser\snot\sregistered/;
      let notRgstRegInfo = notRgstPattern.exec(message.content);
      if(notRgstRegInfo){
        let userID = notRgstRegInfo[1];
        message.channel.send(`<@${userID}> ウォレットが登録されていません。`);
        return;
      }

      let cantTxtPattern = /<@!?(\d+)>,\sCant\ssend\stext/;
      let canTxtRegInfo = cantTxtPattern.exec(message.content);
      if(canTxtRegInfo){
        let userID = canTxtRegInfo[1];
        message.channel.send(`<@${userID}> 文字をtipすることはできません。` + '「スペースが二重に入っていないか」「数字が全角になっていないどうか」などをご確認の上、もう一度お試しください。');
      }


    }
  } else{ // 一般ユーザーが送信した場合
    /*if(message.content.includes("わよ！")){
      message.reply('__***もちろんですわ！***__');
      XPBot.log("log", `${XPBot.config.permLevels.find(l => l.level === level).name} の ${message.author.username}(${message.author.id}) がわよ！を実行しました`, "CMD");
      return;
    }*/
    
    const ainote = require('../modules/ainote.js');
    if(message.channel.name){
      ainote(XPBot, message);
    }

    // PersistentCollectionからこのサーバー用の設定を取得
    // Guildが無い場合はデフォルト設定（DM用）
    const settings = XPBot.getGuildSettings(message.guild);
    //const settings = message.guild ? XPBot.settings.get(message.guild.id) : XPBot.config.defaultSettings;

    // コマンド・関数内で使いやすいように、messageに設定オブジェクトを関連付ける
    message.settings = settings;

    // ユーザーもしくはメンバーの権限を取得
    const level = XPBot.permlevel(message);
    const MainBotPrefix = ',';

    let refString = ['?ref=', '&ref=', '?start=', '?c='];
    let isRef = false;
    refString.map(s => {
      if(message.content.includes(s)) isRef = true;
    })

    if(isRef){
      (async () => {
        let logc = XPBot.getFrontendLogChannel(message.guild);
        let senderGM = await XPBot.safenUsername(XPBot, message.member.displayName);
        let senderUser = message.author.username + '#' + message.author.discriminator;
        let msgAbs = message.content.slice(0, 140);
        let sendAt = new moment(message.createdTimestamp).format('MM[月]DD[日] HH[時]mm[分]ss[秒]');

        const Discord = require("discord.js");

        logc.send('アフィリンクかも？', 
                  new Discord.RichEmbed()
                  .setTitle('検知報告')
                  .addField('ユーザー名(表示)', senderGM, true)
                  .addField('ユーザー名(内部)', senderUser, true)
                  .addField('ユーザーID', message.author.id, true)
                  .addField('メッセージID', message.id, true)
                  .addField('検知場所', message.channel.name, true)
                  .addField('検知日時', sendAt, true)
                  .addField('メッセージ抜粋', msgAbs, false)
                  .setTimestamp()
                  .setColor([255, 0, 0])
                 );
      })();
    }
    
    let nemOion = 'rfselcyqemtp3wgu';
    let hasNemOnion = message.content.includes(nemOion);
    
    if(hasNemOnion){
      (async () => {
        let logc = XPBot.getFrontendLogChannel(message.guild);
        let senderGM = await XPBot.safenUsername(XPBot, message.member.displayName);
        let senderUser = message.author.username + '#' + message.author.discriminator;
        let msgAbs = message.content.slice(0, 140);
        let sendAt = new moment(message.createdTimestamp).format('MM[月]DD[日] HH[時]mm[分]ss[秒]');

        const Discord = require("discord.js");

        logc.send('眠そうな玉ねぎ（盗難NEM販売onionサイト）？', 
                  new Discord.RichEmbed()
                  .setTitle('検知報告')
                  .addField('ユーザー名(表示)', senderGM, true)
                  .addField('ユーザー名(内部)', senderUser, true)
                  .addField('ユーザーID', message.author.id, true)
                  .addField('メッセージID', message.id, true)
                  .addField('検知場所', message.channel.name, true)
                  .addField('検知日時', sendAt, true)
                  .addField('メッセージ抜粋', msgAbs, false)
                  .setTimestamp()
                  .setColor([255, 0, 0])
                 );
      })();
    }
    
    let PDGroup = ['%exx5830y'];
    let isPDGruop = false;
    PDGroup.map(s => {
      if(message.content.includes(s)) isPDGruop = true;
    })
    
    if(isPDGruop){
      (async () => {
        let logc = XPBot.getFrontendLogChannel(message.guild);
        let senderGM = await XPBot.safenUsername(XPBot, message.member.displayName);
        let senderUser = message.author.username + '#' + message.author.discriminator;
        let msgAbs = message.content.slice(0, 140);
        let sendAt = new moment(message.createdTimestamp).format('MM[月]DD[日] HH[時]mm[分]ss[秒]');

        const Discord = require("discord.js");

        logc.send('仕手って知ってる？', 
                  new Discord.RichEmbed()
                  .setTitle('検知報告')
                  .addField('ユーザー名(表示)', senderGM, true)
                  .addField('ユーザー名(内部)', senderUser, true)
                  .addField('ユーザーID', message.author.id, true)
                  .addField('メッセージID', message.id, true)
                  .addField('検知場所', message.channel.name, true)
                  .addField('検知日時', sendAt, true)
                  .addField('メッセージ抜粋', msgAbs, false)
                  .setTimestamp()
                  .setColor([255, 0, 0])
                 );
      })();
    }
    

    if(message.content.indexOf(settings.prefix) === 0){ // XPFaucet-Botのコマンド
      // コマンド名と引数を分離
      // 例: 「+say Is this the real life?」
      // command = say
      // args = ["Is", "this", "the", "real", "life?"]
      const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      // 指定されたコマンド名がコマンドもしくはエイリアスとして存在するか確認
      const cmd = XPBot.commands.get(command) || XPBot.commands.get(XPBot.aliases.get(command));
      // 「const 変数名 = 一方 OR 他方;」は、2つのうちどちらかから値を取得する方法としては見やすくて楽だね
      if(!cmd) return;

      // 一部のコマンドはDMでは使用できないので、それを確認。
      if(cmd && !message.guild && cmd.conf.guildOnly)
        return message.channel.send("指定されたコマンドはDMでは使用できません。サーバー内でお試しください。");

      if(level < XPBot.levelCache[cmd.conf.permLevel]) {
        if(settings.systemNotice === "true") {
          return message.channel.send(`:no_entry_sign: あなたは、指定されたコマンドを実行するのに必要な権限がありません。
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
    } else if(message.content.indexOf(MainBotPrefix) === 0){ //本家Botのコマンド
      const args = message.content.slice(MainBotPrefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      //console.log(message.content, command);

      if(XPBot.MainBotReady === false){
        console.log(message.id, message.author.username, message.channel.name);
        message.reply('Xp-Botが停止しているため、コマンドは実行できません。')
          .then(msg => {
          msg.delete(5000).catch(e=>{
            if(e.code === 10008) XPBot.log('Util', 'メッセージは既に削除されています: ' + e.path, 'ERR');
            else console.error(e);
          });
        });
      }else{

        if(command == 'balance'){
          if(!XPBot.config.allowedBalanceCnls.includes(message.channel.name)){
            message.channel.send('<@' + message.author.id + '> `,balance`コマンドは <@352815000257167362> に直接DMしてお使いください');
          }
        }

        //XPBot.botWatcher['MainBot'].notifyCommand(message, command);
      }
    } else if(message.content.indexOf('?') === 0 || message.content.indexOf('？') === 0){
      const args = message.content.slice(MainBotPrefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
    }
  }
};
