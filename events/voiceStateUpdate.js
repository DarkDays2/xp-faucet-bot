// presenceUpdateイベントはユーザーのステータス変更時に発火します
// 注: Botは全てのイベントに関連付けられているため、関数実行時全てのイベントに
// XPBot, other, args が渡されます。

module.exports = (XPBot, oldMember, newMember) => {
  if(!XPBot.ready) return;
  //if(message.author.bot) return;
  if(oldMember.id === XPBot.user.id) return;

  if(oldMember.bot){
  } else{
    /*let oldC = oldMember.voiceChannel ? oldMember.voiceChannel.name : 'null';
    let newC = newMember.voiceChannel ? newMember.voiceChannel.name : 'null';
    console.log(newMember.displayName, oldC, newC);*/
    var radioChatCnls = {
      'XP_radio802': 'xp_radio802',
      'General': 'general_chat',
      'general2': 'general',
      'developer_only': ''
    };

    if(!oldMember.voiceChannel && newMember.voiceChannel){    
      let radioCnl = newMember.voiceChannel;
      let radioChatCnl = newMember.guild.channels.find('name', radioChatCnls[radioCnl.name]);

      if(!radioChatCnl) return;
      
      if(newMember.presence.status == 'offline' || newMember.presence.status == 'dnd') return;
      //console.log(newMember.displayName);
      radioChatCnl.send(`<@${newMember.id}>さん、いらっしゃ～い`)
        .then(async msg => {
        await XPBot.wait(40000);
        msg.delete();
      });
      
      return;
    }
    
    /*if(oldMember.voiceChannel && newMember.voiceChannel ){
      
    }*/
  }
};
