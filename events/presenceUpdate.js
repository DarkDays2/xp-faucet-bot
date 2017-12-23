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
  }
};
