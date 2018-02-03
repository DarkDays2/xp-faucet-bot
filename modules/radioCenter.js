const Discord = require("discord.js");
//var sqlite3 = require('sqlite3');
var writeLog;

module.exports = function(XPBot) {
  XPBot.radioCenter = {
    data: {},
    ctrler: {},
    dataFormat: gid => {
      XPBot.radioCenter.data[gid.toString()] = {
        disp: null,
        virtualVol: null,
        queue: [],
        autonext: false
      };
    },
    dataReset: gid => {
      XPBot.radioCenter.data[gid.toString()].disp = null;
      XPBot.radioCenter.data[gid.toString()].virtualVol = null;
    }
  };

  XPBot.guilds.map(g => {
    //XPBot.radioCenter.data[g.id.toString()] = XPBot.radioCenter.dataReset();
    XPBot.radioCenter.dataFormat(g.id);
  });

  writeLog = (title, contents)=>{
    XPBot.log('rCnt', contents, title);
  };
};