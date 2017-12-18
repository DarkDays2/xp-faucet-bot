var sqlite3 = require('sqlite3');

module.exports.init = function (XPBot, filename) {
  return new sqlite3.Database(filename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err)=>{
    if(err){
      XPBot.log('db', filename + "への接続中にエラーが発生しました", 'ERR');
      console.error(err.message); 
    } else{
      XPBot.log('db', filename + "に接続しました", 'LOG');
    }
  });
};