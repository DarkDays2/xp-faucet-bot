//var sqlite3 = require('sqlite3');

module.exports = function(XPBot) {
  const sqlite = require('../modules/dbutil.js');
  XPBot.db = new Object();
  XPBot.db.walletDB = sqlite.initDB(XPBot, './db/XpDiscordWallet.db');

  XPBot.db.walletDB.addAddress = (id, address, addBy) => {
    //writeLog('LOG', 'ウォレットDBへアドレスを登録します id: ' + id + ', address: ' + address + ', add_by: ' + addBy);
    var info = '(id: ' + id + ', address: ' + address + ', add_by: ' + addBy + ')';
    return new Promise((resolve, reject) => {
      XPBot.db.walletDB.getAddressById(id)
        .then(adrs => {
        if(!adrs){
          XPBot.db.walletDB.run(
            'INSERT OR IGNORE INTO balance_addresses_on_original VALUES($id, $address, $addBy)',
            {$id: id, $address: address, $addBy: addBy},
            function(err){
              if(err) {
                writeLog('ERR', 'ウォレットDBへのアドレス登録に失敗しました ' + info);
                reject(err);
              }
              writeLog('LOG', 'ウォレットDBへアドレスを登録しました ' + info);
              resolve();
            }
          );
        } else{
          let err = 'ウォレットDBへ既に登録されています ' + info
          writeLog('WAR', err);
          reject(err);
        }
      });
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

  sqlite.initTB(
    XPBot, 
    XPBot.db.walletDB, 
    'balance_addresses_on_original', 
    '本家Bot用アドレステーブル',
    'id TEXT PRIMARY KEY, address TEXT UNIQUE NOT NULL, add_by TEXT NOT NULL'
  );

  const writeLog = (title, contents)=>{
    XPBot.log('db', contents, title);
  };
};