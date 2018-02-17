const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
var writeLog;

module.exports = async function(XPBot, message) {
  writeLog = (title, contents) => {
    XPBot.log('Snitch', contents, title);
  };

  let logc = XPBot.getFrontendLogChannel(message.guild),
      senderGM = await XPBot.safenUsername(XPBot, message.member.displayName),
      senderUser = message.author.username + '#' + message.author.discriminator,
      msgAbs = message.content.slice(0, 140),
      sendAt = new moment(message.createdTimestamp).format('MM[月]DD[日] HH[時]mm[分]ss[秒]');

  let snitch = (cond, condFunc, title) => {
    if(condFunc(cond)){
      logc.send(title,
                new Discord.RichEmbed()
                .setTitle('密告')
                .addField('ユーザー名(表示)', senderGM, true)
                .addField('ユーザー名(内部)', senderUser, true)
                .addField('ユーザーID', message.author.id, true)
                .addField('メッセージID', message.id, true)
                .addField('検知場所', message.channel.name, true)
                .addField('検知日時', sendAt, true)
                .addField('メッセージ抜粋', msgAbs, false)
                .setTimestamp()
                .setColor([255, 0, 0])
               );
    }
  }
  
  // アフィリエイト
  snitch(
    ['?ref=', '&ref=', '?start=', '?c='],
    cond => {
      let isTarget = false;
      cond.map(c => {
        if(message.content.includes(c)) isTarget = true
      });
      return isTarget;
    },
    'アフィリンクかも？'
  );
  
  // NEM
  snitch(
    'rfselcyqemtp3wgu',
    cond => message.content.includes(cond),
    '眠そうな玉ねぎ（盗難NEM販売onionサイト）？'
  );
  
  // 仕手
  snitch(
    ['exx5830y'],
    cond => {
      let isTarget = false;
      cond.map(c => {
        if(message.content.includes(c)) isTarget = true
      });
      return isTarget;
    },
    '仕手って知ってる？'
  );
};