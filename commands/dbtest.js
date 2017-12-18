exports.run = async (XPBot, message, args, level) => {// eslint-disable-line no-unused-vars
  XPBot.db.walletDB.addAddress('abab50123', 'ababTestDADSADASDASD50123')
    .then(() => { 
    XPBot.db.walletDB.getAddressById('abab50123')
      .then(x => { console.log(x)});
  }).catch((ex)=> {console.error(ex)});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "水道局幹部"
};

exports.help = {
  name: "dbtest",
  category: "DB",
  description: "Dbtest",
  usage: "dbtest"
};
