const Discord = require("discord.js");
const ytdl = require('ytdl-core');
//var sqlite3 = require('sqlite3');
var writeLog;

module.exports = function(XPBot) {
  let playYouTube = async ({guild: guild, cnl: cnl, movieID: movieID, opts: {seek = 0, vol = 0.01}, funcStart: funcStart}) => {
    let gID = guild.id.toString();
    
    if(typeof vol !== 'number') throw new TypeError('vol は数値でなければなりません');

    if(XPBot.radioCenter.data[gID].disp !== null){
      await XPBot.radioCenter.ctrler.stop(guild);
      //XPBot.radioCenter.data[gID].disp.end('他のYouTube動画の再生開始');
    }

    cnl.join().then(async cnc => {
      let opts = {seek: seek, volume: vol, passes: 3, bitrate: 'auto'};
      let stream = ytdl('https://www.youtube.com/watch?v=' + movieID, {filter: 'audioonly'});
      await XPBot.wait(100);
      XPBot.radioCenter.data[gID].disp = cnc.playStream(stream, opts);
      if(typeof funcStart === 'function') XPBot.radioCenter.data[gID].disp.on('start', funcStart);
      XPBot.radioCenter.data[gID].disp.on('end', r => {
        //XPBot.radioCenter.data[gID] = XPBot.radioCenter.dataReset();
        XPBot.radioCenter.dataReset(gID);
        if(XPBot.radioCenter.data[gID].autonext) XPBot.radioCenter.ctrler.dequeue(guild);
      });
      XPBot.radioCenter.data[gID].virtualVol = vol;
      
      let numDcn = cnc.listenerCount('disconnect');
      if(numDcn < 1){
        cnc.on('disconnect', ()=>{
          if(XPBot.radioCenter.data[gID].disp) XPBot.radioCenter.data[gID].disp.end('切断');
        });
      }
    });
  };
  
  let playFile = async ({guild: guild, cnl: cnl, fileName: fileName, opts: {seek = 0, vol = 0.01}, funcStart: funcStart}) => {
    let gID = guild.id.toString();

    if(typeof vol !== 'number') throw new TypeError('vol は数値でなければなりません');

    if(XPBot.radioCenter.data[gID].disp !== null){
      await XPBot.radioCenter.ctrler.stop(guild);
      //XPBot.radioCenter.data[gID].disp.end('他の音楽ファイルの再生開始');
    }
    
    cnl.join().then(async cnc => {
      let opts = {seek: seek, volume: vol, passes: 3, bitrate: 'auto'};
      XPBot.radioCenter.data[gID].disp = cnc.playFile('././assets/' + fileName, opts);
      if(typeof funcStart === 'function') XPBot.radioCenter.data[gID].disp.on('start', funcStart);
      XPBot.radioCenter.data[gID].disp.on('end', r => {
        //XPBot.radioCenter.data[gID] = XPBot.radioCenter.dataReset();
        XPBot.radioCenter.dataReset(gID);
        if(XPBot.radioCenter.data[gID].autonext) XPBot.radioCenter.ctrler.dequeue(guild);
      });
      XPBot.radioCenter.data[gID].virtualVol = vol;

      let numDcn = cnc.listenerCount('disconnect');
      if(numDcn < 1){
        cnc.on('disconnect', ()=>{
          if(XPBot.radioCenter.data[gID].disp) XPBot.radioCenter.data[gID].disp.end('切断');
        });
      }
    });
  };
  
  let playFileAlias = ({guild: guild, cnl: cnl, alias: alias, opts: {seek: seek = 0, vol: vol = 0.01}, funcStart: funcStart}) => {
    let pairs = {
      'morning01': 'BGM-Morning01.mp3',
      'techno01': 'BGM-Techno01.mp3',
      'atale': 'A Tale-001b.mp3',
      'akarui1': 'xp_akarui_hourly_loop.mp3',
      'akarui2': 'xp_akarui_2_halfhourly_loop.mp3',
      'wafu': 'xp_wafu_halfhourly_loop.mp3',
      'izakaya01': 'BGM-Izakaya01.mp3'
    };
    
    let filename = pairs[alias];
    if(alias) XPBot.radioCenter.ctrler.playFile({
      guild: guild,
      cnl: cnl,
      fileName: filename,
      opts: {seek: seek, vol: vol},
      funcStart: funcStart
    });
    else throw new TypeError('無効な alias です');
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

  let stop = async (guild) => {
    let gID = guild.id.toString();
    await XPBot.radioCenter.ctrler.setVol(guild, 0, true, 2000);
    XPBot.radioCenter.data[gID].disp.end('再生停止');
  };

  let pause = async (guild) => {
    let gID = guild.id.toString();
    await XPBot.radioCenter.ctrler.setVol(guild, 0, true, 1000, true);
    XPBot.radioCenter.data[gID].disp.pause();
  };

  let resume = async(guild) => {
    let gID = guild.id.toString();
    let vol = XPBot.radioCenter.data[gID].virtualVol;
    XPBot.radioCenter.data[gID].disp.resume();
    XPBot.radioCenter.ctrler.setVol(guild, 0, false, null, true);
    await XPBot.wait(500);
    await XPBot.radioCenter.ctrler.setVol(guild, vol, true, 1500, true);
  }

  let setVol = (guild, vol, fade, fadeSpan, prevVirtualVolChange) => {
    let gID = guild.id.toString();
    if(typeof vol !== 'number') throw new TypeError('vol は数値でなければなりません');
    
    if(vol > 2) vol = 2;
    
    if(!prevVirtualVolChange) XPBot.radioCenter.data[gID].virtualVol = vol;

    if(fade){
      let start = XPBot.radioCenter.data[gID].disp.volume,
          times = fadeSpan / 50,
          diff = vol - start,
          step = diff / times,
          fVol = start;
      return new Promise(async (resolve, reject) => {
        for(let i = 0; i < times; i++){
          fVol += step;
          XPBot.radioCenter.data[gID].disp.setVolume(fVol);
          //console.log(fVol);
          await XPBot.wait(50);
        }
        XPBot.radioCenter.data[gID].disp.setVolume(vol);
        resolve();
      });

    }else{
      if(vol === 0) vol = 0.01;
      XPBot.radioCenter.data[gID].disp.setVolume(vol);
      return true;
    }    
  }
  
  let forceReset = (guild) => {
    XPBot.voiceConnections.find(c => {
      return c.channel.guild.id === guild.id
    }).disconnect();
  }

  /*let fadeOut = async (guild, time) => {
    let gID = guild.id.toString();
    let start = XPBot.radioCenter.data[gID].disp.volume,
        loop = time / 50,
        diff = start / loop;

    for(let foVol = start; foVol >= 0; foVol -= diff){
      XPBot.radioCenter.data[gID].disp.setVolume(foVol);
      console.log(foVol);
      await XPBot.wait(50);
    }
    XPBot.radioCenter.data[gID].disp.end('再生停止');
  }*/
  
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
    setVol: setVol,
    forceReset: forceReset
  };
  
  XPBot.radioCenter.ctrler = Object.assign(oldCtrler, newFuncs);

  writeLog = (title, contents)=>{
    XPBot.log('rSnd', contents, title);
  };
};