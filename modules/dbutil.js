var sqlite3 = require('sqlite3');
var writeLog;

module.exports.initDB = function(XPBot, filename) {
  writeLog = (title, contents)=>{
    XPBot.log('DB', contents, title);
  };
  
  let db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err)=>{
    if(err){
      writeLog('ERR', filename + "への接続中にエラーが発生しました");
      console.error(err.message); 
    } else{
      writeLog('LOG', filename + "に接続しました");
    }
  });
  
  db.closeFromDB = () => {
    return new Promise((resolve, reject) => {
      try{
        XPBot.db.walletDB.close();
        writeLog('LOG', filename + 'から切断しました', );
        resolve();
      } catch(ex){
        writeLog('ERR', filename + 'の切断処理中にエラーが発生しました', );
        reject(ex);
      }
    });
  };
  
  return db;
};

module.exports.initTB = function(XPBot, db, tablename, logname, columnQuery){
  let create = new Promise((resolve, reject) => {
    db.get(
      'SELECT count(*) FROM sqlite_master WHERE type = "table" AND name = $name',
      {$name: tablename},
      function(err, res){
        if(err){
          writeLog('ERR', logname + 'の存在確認に失敗しました', );
          reject(err);
        }
        var exists = false;
        if(0 < res['count(*)']){
          exists = true;
          writeLog('LOG', logname + 'は存在します');
        } else{
          writeLog('LOG', logname + 'は存在しません');
        }
        resolve(exists);
      }
    );
  });

  create.then(x=>{
    if(!x){
      db.run('CREATE TABLE ' + tablename + '(' + columnQuery + ')');
      writeLog('LOG', logname + 'を作成しました');
    }
  }).catch(err =>{
    console.error(err);
  });
  
}