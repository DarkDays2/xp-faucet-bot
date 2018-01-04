// presenceUpdateイベントはユーザーのステータス変更時に発火します
// 注: Botは全てのイベントに関連付けられているため、関数実行時全てのイベントに
// XPBot, other, args が渡されます。

module.exports = (XPBot, oldMsg, newMsg) => {
  if(!XPBot.ready) return;
  //if(message.author.bot) return;
  if(newMsg.author.id === XPBot.user.id) return;

  if(newMsg.author.bot){
    if(XPBot.config.mainBots.includes(newMsg.author.id)){
      let regBalanceMsg = /<@!?(\d+)>,\sBalance:\s\d+(?:\.\d*)?(?:[eE][+-]?\d+)?\s-\s(X\w*)/;
      let regInfo = regBalanceMsg.exec(newMsg.content);

      if(regInfo){
        let userID = regInfo[1]; // Balanceコマンドを実行したUserのID
        let userAddress = regInfo[2]; // Balanceコマンドで出力されたXPウォレットアドレス
        XPBot.db.walletDB.addAddress(userID, userAddress, 'Bot')
          .then(()=>{
          //message.channel.send('DBに登録しました');
        })
          .catch((ex)=>{
          message.channel.send('DBに登録失敗');
        });

        XPBot.botWatcher['MainBot'].notifyResponse(newMsg, userID, 'balance');

        return;
      }
    }
  }
};
