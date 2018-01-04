const Discord = require("discord.js");
//var sqlite3 = require('sqlite3');
var writeLog;

module.exports = function(XPBot, choices, probabilities, blank) {
  writeLog = (title, contents)=>{
    XPBot.log('Lottery', contents, title);
  };
  
  //choices: [a, b, c, d, e]
  //probabilities: [0.4, 0.2, 0.2, 0.1, 0.1]
  var lot = Math.random();
  var threshold = 0;
  var selected = null;
  
  if(choices.length !== probabilities.length){
    throw new TypeError('choices と probabilities の数が一致しません');
  }
  for(let i = 0; i < choices.length; i++){
    threshold += probabilities[i];
    if(lot <= threshold){
      selected = choices[i];
      break;
    }
  }
  
  return selected !== null ? selected : blank;
};