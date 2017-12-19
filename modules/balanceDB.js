//var sqlite3 = require('sqlite3');

module.exports = function(XPBot) {
  const sqlite = require('../modules/dbutil.js');
  XPBot.db = new Object();
  XPBot.db.walletDB = sqlite.init(XPBot, './db/XpDiscordWallet.db');
  
  XPBot.db.walletDB.addAddress = (id, address, addBy) => {
    writeLog('LOG', 'ウォレットDBへアドレスを登録します id: ' + id + ', address: ' + address);
    return new Promise((resolve, reject) => {
      XPBot.db.walletDB.run(
        'INSERT OR IGNORE INTO balance_addresses_on_original VALUES($id, $address, $addBy)',
        {$id: id, $address: address, $addBy: addBy},
        function(err){
          if(err) {
            writeLog('ERR', 'ウォレットDBへのアドレス登録に失敗しました')
            reject(err);
          }
          writeLog('LOG', 'ウォレットDBへアドレスを登録しました')
          resolve();
        }
      );
    });
  };

  XPBot.db.walletDB.getAddressById = (id) => {
    return new Promise((resolve, reject) => {
      XPBot.db.walletDB.serialize(function(){
        XPBot.db.walletDB.get(
          'SELECT address FROM balance_addresses_on_original where id = $id',
          {$id: id},
          function(err, res){
            if(err) reject(err);
            resolve(res);
          }
        );
      });
    });
  };
  
  XPBot.db.walletDB.closeFromDB = () => {
    return new Promise((resolve, reject) => {
      try{
        XPBot.db.walletDB.close();
        writeLog('ERR', 'ウォレットDBから切断しました', );
        resolve();
      } catch(ex){
        writeLog('ERR', 'ウォレットDBの切断処理中にエラーが発生しました', );
        reject(ex);
      }
    });
  };

  let create = new Promise((resolve, reject) => {
    XPBot.db.walletDB.get(
      'SELECT count(*) FROM sqlite_master WHERE type = "table" AND name = $name',
      {$name: 'balance_addresses_on_original'},
      function(err, res){
        if(err){
          writeLog('ERR', '本家Bot用アドレステーブルの存在確認に失敗しました', );
          reject(err);
        }
        var exists = false;
        if(0 < res['count(*)']){
          exists = true;
          writeLog('LOG', '本家Bot用アドレステーブルは存在します');
        } else{
          writeLog('LOG', '本家Bot用アドレステーブルは存在しません');
        }
        resolve(exists);
      }
    );
  });
  
  create.then(x=>{
    if(!x){
      XPBot.db.walletDB.run('CREATE TABLE balance_addresses_on_original(id TEXT PRIMARY KEY , address TEXT UNIQUE NOT NULL)');
      writeLog('LOG', '本家Bot用アドレステーブルを作成しました');
    }
  }).catch(err =>{
    console.error(err);
  });
  
  const writeLog = (title, contents)=>{
    XPBot.log('db', contents, title);
  };
};