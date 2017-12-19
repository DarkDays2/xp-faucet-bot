var sqlite3 = require('sqlite3');
var writeLog;

module.exports.init = function(XPBot, filename) {
  writeLog = (title, contents)=>{
    XPBot.log('db', contents, title);
  };
  return new sqlite3.Database(filename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err)=>{
    if(err){
      writeLog('ERR', filename + "への接続中にエラーが発生しました");
      console.error(err.message); 
    } else{
      writeLog('LOG', filename + "に接続しました");
    }
  });
};