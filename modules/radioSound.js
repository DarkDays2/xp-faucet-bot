const Discord = require("discord.js");
const ytdl = require('ytdl-core');
//var sqlite3 = require('sqlite3');
const soundData = require('../assets/soundData.js');
var writeLog;

module.exports = function(XPBot) {
  let _registerDisposingHandler = (gID, cnc) => {
    XPBot.radioCenter.data[gID].disp.on('end', r => {
      XPBot.radioCenter.dataReset(gID);
      if(XPBot.radioCenter.data[gID].autonext) XPBot.radioCenter.ctrler.dequeue(guild);
    });

    let numDcn = cnc.listenerCount('disconnect');
    if(numDcn < 1){
      cnc.on('disconnect', ()=>{
        if(XPBot.radioCenter.data[gID].disp) XPBot.radioCenter.data[gID].disp.end('切断');
      });
    }
  };
  
  let playYouTube = async ({guild: guild, cnl: cnl, movieID: movieID, opts: {seek = 0, vol = 0.01}, funcStart: funcStart}) => {
    let gID = guild.id.toString();
    vol = vol - 0;
    
    if(isNaN(vol)) throw new TypeError('vol は数値に変換できる必要があります');

    if(XPBot.radioCenter.data[gID].disp !== null){
      await XPBot.radioCenter.ctrler.stop(guild, '他のYouTube動画の再生開始');
    }

    cnl.join().then(async cnc => {
      let opts = {seek: seek, volume: vol, passes: 3, bitrate: 'auto'};
      let stream = ytdl('https://www.youtube.com/watch?v=' + movieID, {filter: 'audioonly'});
      await XPBot.wait(100);
      XPBot.radioCenter.data[gID].disp = cnc.playStream(stream, opts);
      if(typeof funcStart === 'function') XPBot.radioCenter.data[gID].disp.on('start', funcStart);
      
      _registerDisposingHandler(gID, cnc);
      XPBot.radioCenter.data[gID].virtualVol = vol;
    });
  };
  
  let playFile = async ({guild: guild, cnl: cnl, fileName: fileName, opts: {seek = 0, vol = 0.01}, funcStart: funcStart}) => {
    let gID = guild.id.toString();
    vol = vol - 0;

    if(isNaN(vol)) throw new TypeError('vol は数値に変換できる必要があります');

    if(XPBot.radioCenter.data[gID].disp !== null){
      await XPBot.radioCenter.ctrler.stop(guild, '他の音楽ファイルの再生開始');
    }
    
    cnl.join().then(async cnc => {
      let opts = {seek: seek, volume: vol, passes: 3, bitrate: 'auto'};
      XPBot.radioCenter.data[gID].disp = cnc.playFile('././assets/' + fileName, opts);
      if(typeof funcStart === 'function') XPBot.radioCenter.data[gID].disp.on('start', funcStart);
      
      _registerDisposingHandler(gID, cnc);
      XPBot.radioCenter.data[gID].virtualVol = vol;
    });
  };
  
  let playFileAlias = ({guild: guild, cnl: cnl, alias: alias, opts: {seek: seek = 0, vol: vol = 0.01}, funcStart: funcStart}) => {
    if(alias in soundData){
      XPBot.radioCenter.ctrler.playFile({
        guild: guild,
        cnl: cnl,
        fileName: soundData[alias].fileName,
        opts: {seek: seek, vol: vol},
        funcStart: funcStart
      });
    } else
      throw new TypeError('無効な alias です');
  };
  
  let enqueue = (type, args) => {
    let gID = args.guild.id.toString()
    XPBot.radioCenter.data[gID].queue.push({type: type, args: args});
  };
  
  let dequeue = (guild) => {
    let gID = guild.id.toString();
    if(XPBot.radioCenter.data[gID].queue.length > 0){
      let {type, args} = XPBot.radioCenter.data[gID].queue.shift();
      XPBot.radioCenter.ctrler[type](args);
    }
  }
  
  let setAutonext = (guild, value) => {
    let gID = guild.id.toString();
    XPBot.radioCenter.data[gID].autonext = value;
  };

  let stop = async (guild, reason = '再生停止') => {
    let gID = guild.id.toString();    
    await XPBot.radioCenter.ctrler.fade(guild, 0, 1000, true);
    if(XPBot.radioCenter.data[gID].disp) XPBot.radioCenter.data[gID].disp.end(reason);
  };

  let pause = async (guild) => {
    let gID = guild.id.toString();
    await XPBot.radioCenter.ctrler.fade(guild, 0, 1000, true);
    if(XPBot.radioCenter.data[gID].disp) XPBot.radioCenter.data[gID].disp.pause();
  };

  let resume = async(guild) => {
    let gID = guild.id.toString();
    if(!XPBot.radioCenter.data[gID].disp) return;
    
    let vol = XPBot.radioCenter.data[gID].virtualVol;
    XPBot.radioCenter.data[gID].disp.resume();
    XPBot.radioCenter.ctrler.changeVol(guild, 0, false);
    await XPBot.wait(500);
    await XPBot.radioCenter.ctrler.fade(guild, vol, 1500, true);
  }

  let changeVol = (guild, vol, prevVirtualVolChange) => {
    let gID = guild.id.toString();
    if(!XPBot.radioCenter.data[gID].disp) return;
    if(typeof vol !== 'number') throw new TypeError('vol は数値でなければなりません');
    
    //if(vol > 2) vol = 2;
    if(vol === 0) vol = 0.01;
    
    if(!prevVirtualVolChange) XPBot.radioCenter.data[gID].virtualVol = vol;
    
    XPBot.radioCenter.data[gID].disp.setVolume(vol);
    return true; 
  }
  
  let fade = (guild, vol, fadeSpan, prevVirtualVolChange) => {
    let gID = guild.id.toString();
    if(!XPBot.radioCenter.data[gID].disp) return;
    if(typeof vol !== 'number') throw new TypeError('vol は数値でなければなりません');

    //if(vol > 2) vol = 2;

    if(!prevVirtualVolChange) XPBot.radioCenter.data[gID].virtualVol = vol;

    let start = XPBot.radioCenter.data[gID].disp.volume,
        times = fadeSpan / 50,
        diff = vol - start,
        step = diff / times,
        fVol = start;
    return new Promise(async (resolve, reject) => {
      for(let i = 0; i < times; i++){
        fVol += step;
        if(XPBot.radioCenter.data[gID].disp) XPBot.radioCenter.data[gID].disp.setVolume(fVol);
        else break;
        await XPBot.wait(50);
      }
      if(XPBot.radioCenter.data[gID].disp) XPBot.radioCenter.data[gID].disp.setVolume(vol);
      resolve();
    });
  }
  
  let forceReset = (guild) => {
    XPBot.voiceConnections.find(c => {
      return c.channel.guild.id === guild.id
    }).disconnect();
  }
  
  let oldCtrler = XPBot.radioCenter.ctrler;
  
  let newFuncs = {
    playYouTube: playYouTube,
    playFile: playFile,
    playFileAlias: playFileAlias,
    enqueue: enqueue,
    dequeue: dequeue,
    setAutonext: setAutonext,
    stop: stop,
    pause: pause,
    resume: resume,
    changeVol: changeVol,
    fade: fade,
    forceReset: forceReset
  };
  
  XPBot.radioCenter.ctrler = Object.assign(oldCtrler, newFuncs);

  writeLog = (title, contents)=>{
    XPBot.log('rSnd', contents, title);
  };
};