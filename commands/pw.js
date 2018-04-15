exports.run = async (XPBot, message, args, level) => {// eslint-disable-line no-unused-vars
  var guild = message.guild;

  var channel = guild.channels.get('404160942172012554');

  var works = [];

  let tabulation = async channel => {
    var prevStart = '';
    var loopEnd = false;
    var totalSize = 0;

    do{
      let promise = channel.fetchMessages({
        limit: 100,
        before: prevStart
      }).catch(console.error);

      let messages = await promise;
      //prevMegs = messages;
      //console.log("aaa");
      let last = messages.last();
      prevStart = last ? last.id : 'NONE';
      let size = messages.size;
      loopEnd = size < 100;
      totalSize += size;

      //console.log(prevStart, size, loopEnd, totalSize);

      messages.forEach(async msg => {
        //<:xpchan01:391497596461645824>\s(\d\d)/\d\d
        //console.log("     TRUE: ", msgs.content);
        let reg = /<:xpchan01:391497596461645824>\s\*(\d\d)\/\d\d\*\n<@!?(\d+)>/;
        let regInfo = reg.exec(msg.content);

        if(regInfo){
          let stamp = msg.reactions.first();
          let count = stamp.count;
          //let user = await guild.fetchMember(regInfo[2]);
          works.push({
            number: regInfo[1],
            name: regInfo[2],
            count: count
          });
        }
      });
    } while(!loopEnd);
    console.log("end", totalSize);
    //XPBot.user.setGame('');
  };

  //XPBot.user.setGame('しゅうけい');

  await tabulation(channel);
  
  let logc = XPBot.getFrontendLogChannel(guild);
  
  works = works.reverse();
  var strWorks = "";
  works.map(w => {
    strWorks += `No.${w.number} - <@${w.name}> さん - ${w.count}票\r\n`;
  })
  
  //console.log(works);
  //console.log(strWorks);
  
  await logc.send('集計（No順）');
  await logc.send(strWorks, {code:true, split: true});
  
  await XPBot.wait(3000);
  
  let res = works.sort((a, b) => b.count - a.count);
  var strRes = '';
  var order = 0;
  res.map(r => {
    order++;
    strRes += `${order}位 - <@${r.name}> さん（No.${r.number} / ${r.count}票）\r\n`;
  })
  
  await logc.send('集計（順位）');
  await logc.send(strRes, {code:true, split: true});
  console.log(res.length);
  
  
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "モデレーター"
};

exports.help = {
  name: "pw",
  category: "ペーパーウォレット",
  description: "集計",
  usage: "pw"
};
