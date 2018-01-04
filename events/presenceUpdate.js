// presenceUpdateイベントはユーザーのステータス変更時に発火します
// 注: Botは全てのイベントに関連付けられているため、関数実行時全てのイベントに
// XPBot, other, args が渡されます。

module.exports = (XPBot, oldUser, newUser) => {
  if(!XPBot.ready) return;
  //if(message.author.bot) return;
  if(oldUser.id === XPBot.user.id) return;

  if(oldUser.bot){
    if(XPBot.config.mainBots.includes(oldUser.id)){

    }
  } else{
    //console.log(oldUser.id);
    if(newUser.id == '352230801741578240' && newUser.presence.status == 'online') {//Kazmaro
      var guild = XPBot.guilds.get(newUser.guild.id);
      var chat2 = guild.channels.find('name', 'chat_2_jk');
      if(chat2){
        //chat2.send('【報告】 Botの負荷がヤバいときに\r\n<@352230801741578240> 嬢 おはよ！わよ\r\nって言うのは不謹慎なので言うのを止めました');
      }
      
    }
  }
};
