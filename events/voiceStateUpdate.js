// presenceUpdateイベントはユーザーのステータス変更時に発火します
// 注: Botは全てのイベントに関連付けられているため、関数実行時全てのイベントに
// XPBot, other, args が渡されます。
const lotSys = require('../modules/lotterySystem.js');
module.exports = (XPBot, oldMember, newMember) => {
  if(!XPBot.ready) return;
  //if(message.author.bot) return;
  if(oldMember.id === XPBot.user.id){
    if(oldMember.voiceChannelID !== newMember.voiceChannelID){
      if(!newMember.voiceChannelID){
        if(oldMember.voiceChannel.guild.id !== '374188134013075467') return;
        
        XPBot.user.setPresence({game: null});
      } else{
        if(newMember.voiceChannel.guild.id !== '374188134013075467') return;
        
        let str = newMember.voiceChannel.name;
        console.log(str);
        XPBot.user.setActivity(str, {type: 'LISTENING'});
      }
    }
    return;
  }

  if(oldMember.bot){
  } else{
    /*let oldC = oldMember.voiceChannel ? oldMember.voiceChannel.name : 'null';
    let newC = newMember.voiceChannel ? newMember.voiceChannel.name : 'null';
    console.log(newMember.displayName, oldC, newC);*/
    /*var radioChatCnls = {
      'XP_radio802': 'xp_radio802',
      'freetalk': 'vc_freetalk',
      'general2': 'general',
      'developer_only': '',
      'ofuton': ''
    };*/

    let welcomeVC = m => {
      let radioCnl = m.voiceChannel;
      let radioChatCnlName = XPBot.getRadioChatCnl(radioCnl);
      if(!radioChatCnlName) return;

      let radioChatCnl = m.guild.channels.find('name', radioChatCnlName);
      if(!radioChatCnl) return;

      let numRadioMember = radioCnl.members.size;
      let delMs;

      if(radioChatCnl >= 200) return;
      else if(radioChatCnl >= 150) delMs = 15000;
      else if(radioChatCnl >= 100) delMs = 20000;
      else if(radioChatCnl >= 80) delMs = 30000;
      else delMs = 40000;

      let joinMsgs = [
        `<@${m.id}>さん、いらっしゃ～い`,
        `、、、ん！？　そうか！そこで <@${m.id}> か！！`,
        `「まだ <@${m.id}> してないの？」`
      ];

      let joinMsg = lotSys(XPBot, joinMsgs, [0.6, 0.3, 0.1]);

      radioChatCnl.send(joinMsg)
        .then(async msg => {
        //await XPBot.wait(40000);
        msg.delete(delMs).catch(e=>{
          if(e.code === 10008) XPBot.log('Util', 'メッセージは既に削除されています: ' + e.path, 'ERR');
          else console.error(e);
        });
      });
    };

    if(
      (!oldMember.voiceChannel && newMember.voiceChannel)
      || (oldMember.voiceChannel && newMember.voiceChannel
          && oldMember.voiceChannel.id !== newMember.voiceChannel.id)
    ){
      if(newMember.selfDeaf || newMember.serverDeaf) return;
      if(newMember.presence.status == 'offline' || newMember.presence.status == 'dnd') return;

      welcomeVC(newMember);
      return;
    }

    (async () => {
      if(newMember.voiceChannel){
        let logc = XPBot.getFrontendLogChannel(newMember.guild);
        let memName = await XPBot.safenUsername(XPBot, newMember.displayName);
        let msg = null;
        let embedColor = null;

        if(!oldMember.serverMute && newMember.serverMute){
          msg = ':mute: サーバーミュート設定: ' + memName;
          embedColor = 'RED';
          console.log('serverMute:', newMember.displayName);
        }

        if(oldMember.serverMute && !newMember.serverMute){
          msg = ':speaker: サーバーミュート解除: ' + memName;
          console.log('serverUnMute:', newMember.displayName);
          embedColor = 'GREEN';
        }

        if(!oldMember.serverDeaf && newMember.serverDeaf){
          msg = ':mute: サーバー側スピーカーミュート設定: ' + memName;
          console.log('ServerDeaf:', newMember.displayName);
          embedColor = 'DARK_RED';
        }

        if(oldMember.serverDeaf && !newMember.serverDeaf){
          msg = ':speaker: サーバー側スピーカーミュート解除: ' + memName;
          console.log('ServerUnDeaf:', newMember.displayName);
          embedColor = 'DARK_GREEN';
        }
        if(msg !== null){
          const Discord = require("discord.js");

          logc.send(msg, 
                    new Discord.RichEmbed()
                    .setTitle('VC設定変更')
                    .addField('ユーザー名', memName, true)
                    .addField('ユーザーID', newMember.id, true)
                    //.addField('チャンネル名', newMember.voiceChannel.name, true)
                    .setTimestamp()
                    .setColor(embedColor)
                   );
        }
      }
    })();
  }
};
