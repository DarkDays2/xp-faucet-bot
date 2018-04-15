// presenceUpdateイベントはユーザーのステータス変更時に発火します
// 注: Botは全てのイベントに関連付けられているため、関数実行時全てのイベントに
// XPBot, other, args が渡されます。

module.exports = (XPBot, oldMsg, newMsg) => {
  if(!XPBot.ready) return;
  //if(message.author.bot) return;
  if(newMsg.author.id === XPBot.user.id) return;

  if(newMsg.author.bot){
    if(newMsg.author.id == XPBot.config.WWWalletBot){
      
      let balResPattern = /Balance:\s\d+(?:\.\d*)?\s(?:-\sBot\sBalance:\s\d+(?:\.\d*)?\s)?-\s(X\w*)/;
      let balResRegInfo = balResPattern.exec(newMsg.content);

      if(balResRegInfo){
        //let userID = balResRegInfo[1]; // Balanceコマンドを実行したUserのID
        let userAddress = balResRegInfo[1]; // Balanceコマンドで出力されたXPウォレットアドレス

        let userField = newMsg.embeds[0].fields.find((elem, index, arr) => {
          return elem.name === 'User:';
        });

        let userName = userField.value;

        //console.log(userName);
        if(!userName) return;
        
        let v = XPBot.vpg.getValues(newMsg.guild.id);
        if(!v) return;

        if(v.allowedBalanceCnls && !v.allowedBalanceCnls.includes(newMsg.channel.name)){
          newMsg.delete()
            .then(msg => {
            console.log('[Deleted]', newMsg.channel.name);
            //newMsg.channel.send('`,balance`コマンドは <#375532870376357889> チャンネルでお使いください');
          }).catch(e=>{
            if(e.code === 10008) /*空文*/ ;
            else console.error(e);
          });
        }

        (async () => {
          let fetchedUsers = await newMsg.guild.fetchMembers(userName, 10);

          //console.log('catched balance(up)', userName);
          //console.log(fetchedUsers.members.size);
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
      
      
      /*let regBalanceMsg = /<@!?(\d+)>,\sBalance:\s\d+(?:\.\d*)?(?:[eE][+-]?\d+)?\s-\s(X\w*)/;
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
      }*/
    }
  }
};
