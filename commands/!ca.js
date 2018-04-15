exports.run = async (XPBot, message, args, level) => {// eslint-disable-line no-unused-vars
  var guild = message.guild;

  var channels = guild.channels;

  if(!args[0]){
    message.reply('チャンネル名を指定してください');
    XPBot.log('!ca', 'チャンネル名を指定してください', 'ERR');
    return;
  }
  
  let doCA = async channel => {
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

      console.log(prevStart, size, loopEnd, totalSize);

      messages.forEach(async msg => {
        let byMainBot = true; //msg.author.id === '352815000257167362';
        if(!byMainBot) return;

        let isReturnOfBalance = msg.content.includes('Balance:');
        if(!isReturnOfBalance) return;

        if(byMainBot && isReturnOfBalance){
          //console.log("     TRUE: ", msgs.content);
          let regBalanceMsg = /<@!?(\d+)>,\sBalance:\s\d+(?:\.\d*)?(?:[eE][+-]?\d+)?\s-\s(X\w*)/;
          let regInfo = regBalanceMsg.exec(msg.content);

          if(regInfo){
            let userID = regInfo[1]; // Balanceコマンドを実行したUserのID
            let userAddress = regInfo[2]; // Balanceコマンドで出力されたXPウォレットアドレス
            console.log("     ", regInfo[1], regInfo[2]);
            await XPBot.db.walletDB.addAddress(userID, userAddress, 'Bot');
          }
        }
      });
    } while(!loopEnd);
    console.log("end", totalSize);
    XPBot.user.setGame('');
  };
  
  XPBot.user.setGame('アドレスを取得中');
  
  if(args[0] === 'all'){
    channels.forEach(channel => {
      //console.log("#", channel.name);
      if(!channel.fetchMessages) return;
      
      XPBot.log('!ca', 'アドレスの取得を開始: #' + channel.name);
      doCA(channel);
    });
    
  } else{
    if(!channels.exists('name', args[0])){
      message.reply(args[0] + 'チャンネルは存在しません');
      XPBot.log('!ca', args[0] + 'チャンネルは存在しません', 'ERR');
      return;
    }

    let channel = channels.find('name', args[0]);
    if(!channel.fetchMessages) return;
    
    XPBot.log('!ca', 'アドレスの取得を開始: #' + channel.name);
    doCA(channel);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot管理者"
};

exports.help = {
  name: "!ca",
  category: "データベース",
  description: "開発用",
  usage: "!ca <チャンネル名>"
};
