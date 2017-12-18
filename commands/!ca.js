exports.run = async (XPBot, message, args, level) => {// eslint-disable-line no-unused-vars
  /*XPBot.db.walletDB.addAddress('abab50123', 'ababTestDADSADASDASD50123')
    .then(() => { 
    XPBot.db.walletDB.getAddressById('abab50123')
      .then(x => { console.log(x)});
  }).catch((ex)=> {console.error(ex)});*/

  var guild = message.guild;

  var channels = guild.channels;
  
  if(!args[0]){
    message.reply('チャンネル名を指定してください');
    XPBot.log('!ca', 'チャンネル名を指定してください', 'ERR');
    return;
  }
  
  if(!channels.exists('name', args[0])){
    message.reply(args[0] + 'チャンネルは存在しません');
    XPBot.log('!ca', args[0] + 'チャンネルは存在しません', 'ERR');
    return;
  }

  channels.forEach(channel => {
    console.log("#", channel.name);
    if(!channel.fetchMessages) return;

    (async()=>{
      var prevStart = '';
      var loopEnd = false;
      var totalSize = 0;
      
      do{
        let promise = channel.fetchMessages({
          limit: 100,
          before: prevStart
        }).catch(console.error);

        let messages = await promise;
        //prevMegs = messages;
        //console.log("aaa");
        let last = messages.last();
        prevStart = last ? last.id : 'NONE';
        let size = messages.size;
        loopEnd = size < 100;
        totalSize += size;

        //console.log(prevStart, size, loopEnd, totalSize);

        messages.forEach(msg => {
          let byMainBot = true; //msg.author.id === '352815000257167362';
          if(!byMainBot) return;

          let isReturnOfBalance = msg.content.includes('Balance:');
          if(!isReturnOfBalance) return;

          if(byMainBot && isReturnOfBalance){
            //console.log("     TRUE: ", msgs.content);
            let regBalanceMsg = /<@(\d+)>,\sBalance:\s\d+(?:\.\d*)?(?:[eE][+-]?\d+)?\s-\s(X\w*)/;
            let regInfo = regBalanceMsg.exec(msg.content);

            if(regInfo){
              let userID = regInfo[1]; // Balanceコマンドを実行したUserのID
              let userAddress = regInfo[2]; // Balanceコマンドで出力されたXPウォレットアドレス
              console.log("     ", regInfo[1], regInfo[2]);
              /*await */XPBot.db.walletDB.addAddress(userID, userAddress);
            }
          }
        });
      } while(!loopEnd);
      console.log("end", totalSize);
    })();
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "水道局幹部"
};

exports.help = {
  name: "!ca",
  category: "データベース",
  description: "指定されたチャンネルの発言ログから、Xp-BotによるBalanceコマンドの応答を探し、ユーザーのIDとウォレットアドレスをDB化します。",
  usage: "!ca <チャンネル名>"
};
