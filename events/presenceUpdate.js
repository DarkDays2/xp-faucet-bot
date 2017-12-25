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
      var chat2 = guild.channels.find('name', 'chat_2');
      if(chat2){
        chat2.send('<@352230801741578240> 嬢 おはよ！わよ！');
      }
      
    }
    /*if(newUser.id == '353169534984912896' && newUser.presence.status == 'online') {
      var guild = XPBot.guilds.get(newUser.guild.id);
      var chat2 = guild.channels.find('name', 'bot_control');
      if(chat2){
        chat2.send('<@353169534984912896> 嬢 おはよ！わよ！');
      }
    }*/
  }
};
