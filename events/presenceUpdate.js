// presenceUpdateイベントはユーザーのステータス変更時に発火します
// 注: Botは全てのイベントに関連付けられているため、関数実行時全てのイベントに
// XPBot, other, args が渡されます。

module.exports = (XPBot, oldMember, newMember) => {
  if(!XPBot.ready) return;
  //if(message.author.bot) return;
  if(oldMember.id === XPBot.user.id) return;

  if(oldMember.id == XPBot.config.WWWalletBot){
    //let wwbot = await XPBot.guilds.find('name', 'XP 日本').fetchMember(XPBot.config.WWWalletBot);
    XPBot.MainBotReady = newMember.presence.status !== 'offline';
    console.log('WWWalletBot\'s ready turned into:', XPBot.MainBotReady);
  } else{
  }
};
