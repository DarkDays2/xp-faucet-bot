// presenceUpdateイベントはユーザーのステータス変更時に発火します
// 注: Botは全てのイベントに関連付けられているため、関数実行時全てのイベントに
// XPBot, other, args が渡されます。

module.exports = (XPBot, oldMember, newMember) => {
  if(!XPBot.ready) return;
  //if(message.author.bot) return;
  if(oldMember.id === XPBot.user.id) return;

  if(oldMember.bot){
    if(oldMember.id == XPBot.config.WWWalletBot){
      //let wwbot = await XPBot.guilds.find('name', 'XP 日本').fetchMember(XPBot.config.WWWalletBot);
      XPBot.MainBotReady = newMember.presence.status !== 'offline';
      console.log('WWWalletBot\'s ready turned into:', XPBot.MainBotReady);
    }
  } else{
    //console.log(oldMember.id);
    if(newMember.id == '352230801741578240' && newMember.presence.status == 'online') {//Kazmaro
      var guild = XPBot.guilds.get(newMember.guild.id);
      var chat2 = guild.channels.find('name', 'chat_2_jk');
      if(chat2){
        //chat2.send('【報告】 Botの負荷がヤバいときに\r\n<@352230801741578240> 嬢 おはよ！わよ\r\nって言うのは不謹慎なので言うのを止めました');
      }
      //
    }
    
    if(newMember.id == '391174443617222656' && newMember.presence.status == 'online') {//Utage
      var guild = XPBot.guilds.get(newMember.guild.id);
      var chat2 = guild.channels.find('name', 'chat_2_jk');
      if(chat2){
        chat2.send('<@391174443617222656> 、、、ん！？　そうか！そこで__**Monacoin**__か！！');
      }
      
      return;
      //391174443617222656
    }
  }
};
