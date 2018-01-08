exports.run = async (XPBot, message, args, level) => { // eslint-disable-line no-unused-vars
  message.delete();
  
  let id = args.shift();
  let cnl = message.channel;
  
  let msg = await cnl.fetchMessage(id);
  
  if(msg){
    let stampLetters = args.shift().toLowerCase().split('');
    var ended = '';
    if(stampLetters){
      for(var stampLet of stampLetters){
        var stampName;
        
        if(ended.includes(stampLet)){
          switch(stampLet){
            case 'a':
              stampName = 'a';
              break;
            case 'b':
              stampName = 'b';
              break;
            case 'o':
              stampName = 'o';
              break;
            case 'i':
              stampName = 'information_source';
              break;
            default:
              stampName = 'regional_indicator_' + stampLet;
              break;
          }
        } else{
          stampName = 'regional_indicator_' + stampLet;
        }
        
        
        let stamp = XPBot.emojisByName[stampName];
        await msg.react(stamp);
        ended += stampLet;
      }
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['stamp'],
  permLevel: "一般利用者"
};

exports.help = {
  name: "react",
  category: "その他",
  description: "絵文字テロ",
  usage: "react <メッセージID> <アルファベット文字列>"
};
