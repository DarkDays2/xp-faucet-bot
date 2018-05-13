const ytdl = require('ytdl-core');
//const sendSpam = require('../modules/sendSpam.js');
const soundData = require('../assets/soundData.js');

exports.run = async (XPBot, message, args, level) => {// eslint-disable-line no-unused-vars
  message.delete();

  console.log(args.join(' '));
  require('../modules/radioSound.js')(XPBot);

  let guild = message.guild;
  var subCmdName = args.shift();

  if(subCmdName == 'help'){
    let helpCmd = args.shift();
    var output = '';
    
    switch(helpCmd){
      case 'bgm':
        output += `= radiocmdコマンド bgmサブコマンド ヘルプ =
音楽を再生します(YouTube/ローカルファイル再生)

== !!radiocmd bgm yt <動画ID> <音量> ==
YouTubeの動画を再生します(著作権に注意)
https://www.youtube.com/watch?v=<動画ID>

== !!radiocmd bgm <BGM名> ==
XPFaucet-Botのローカルに保存されているファイルを再生します
`;
        let soundNames = Array.from(Object.keys(soundData));
        let longest = soundNames.reduce((long, str) => Math.max(long, str.length), 0);
        let soundDataMap = new Map(Object.entries(soundData));
        soundDataMap.forEach((data, alias) => {
          output += ` ${alias}${' '.repeat(longest - alias.length)} - ${data.descShort}\r\n`;
        });
        
        output += `
== !!radiocmd bgm pause ==
現在流れているBGM・ジングルを一時停止させます

== !!radiocmd bgm resume ==
一時停止中のBGM・ジングルを再開させます

== !!radiocmd bgm stop ==
現在流れているBGM・ジングルを停止させます

== !!radiocmd bgm vol ==
現在の音量を表示します

== !!radiocmd bgm vol <音量> ==
音量を変更します (フェード無し)

== !!radiocmd bgm vol <音量> fade <フェードミリ秒> ==
音量を変更します (フェードあり)
フェード時間はミリ秒(1000分の1秒)で指定します

== 音量について ==
YouTubeからBGMを再生する場合のみ、音量を指定可能
音量は、0.1倍。1が10%、0.1が1%`
        break;
      default:
        output += 
          '= radiocmdコマンド ヘルプ =\r\n\r\n' +
          '[!!radiocmd help <サブコマンド名> で詳細表示]\r\n\r\n' + 
          'bgm  :: 音楽を再生します(YouTube/ローカルファイル再生)\r\n' +
          'help :: このヘルプを表示します。\r\n';
        break;
    }
    message.channel.send(output, {code: "asciidoc", split: { char: "\u200b" }});
    return;

  } else if(subCmdName == 'reset'){
    XPBot.radioCenter.ctrler.forceReset(guild);
    return;
  }

  var radioCnl =
      guild.channels.find(val => val.type === 'voice' && val.name === args[args.length - 1]) ||
      message.member.voiceChannel ? message.member.voiceChannel
                                  : null;
  if(radioCnl === null) return;
  /*if(!radioCnl){
    if(message.member.voiceChannel) radioCnl = message.member.voiceChannel;
    else return;
  }*/
  
  let radioChatCnlName = XPBot.getRadioChatCnl(guild, radioCnl);
  var radioChatCnl;
  if(radioChatCnlName) radioChatCnl = guild.channels.find('name', radioChatCnlName);

  if(subCmdName == 'bgm'){
    let type = args.shift().toLowerCase();
    
    let setVol = vol => {
      let newVol = vol//args.shift();
      if(typeof newVol === 'undefined'){
        let current = XPBot.radioCenter.data[guild.id.toString()].virtualVol.toFixed(3);
        message.reply(`現在の音量: ${current * 10} (${current * 100}%)`);
      } else{
        newVol = parseFloat(newVol) * 0.1;
        let fade = args.shift();
        if(fade == 'fade'){
          let fadeSpan = parseFloat(args.shift());
          XPBot.radioCenter.ctrler.fade(guild, newVol, fadeSpan);
        } else{
          XPBot.radioCenter.ctrler.changeVol(guild, newVol, false);
        }
      }
    }
    
    if(parseFloat(type)){
      setVol(parseFloat(type))
      return;
    }
    
    if(type == 'stop'){
      XPBot.radioCenter.ctrler.stop(guild);
      return;
    } else if(type == 'pause'){
      XPBot.radioCenter.ctrler.pause(guild);
      return;
    } else if(type == 'resume'){
      XPBot.radioCenter.ctrler.resume(guild);
      return;
    } else if(type == 'vol'){
      setVol(args.shift());
      return;
    } else if(typeof type === 'undefined'){
      return;
    }

    if(type == 'yt'){ // !!radiocmd bgm yt <ID> <vol> [cnl]
      let videoId = args.shift();
      let vol = parseFloat(args.shift()) ? vol * 0.1 : 0.01;

      //vol = vol ? vol * 0.1 : 0.01;
      XPBot.radioCenter.ctrler.playYouTube({
        guild: guild,
        cnl: radioCnl,
        movieID: videoId,
        opts: {vol: vol},
        funcStart: async () => {
          await XPBot.wait(1000);
          if(radioChatCnl) radioChatCnl.send('BGM: https://www.youtube.com/watch?v=' + videoId);
        }
      });
    } else{
      let alieas = type;
      if(alieas in soundData){
        XPBot.radioCenter.ctrler.playFileAlias({
          guild: guild,
          cnl: radioCnl,
          alias: alieas,
          opts: {vol: soundData[alieas].defautVol},
          funcStart: async () => {
            await XPBot.wait(1000);
            if(radioChatCnl) radioChatCnl.send(soundData[alieas].descShort);
          }
        });
      }
    }

  } else if(subCmdName == 'jingle'){
    let num = ('00' + args.shift().toString()).slice(-2);
    
    /*仮措置*/
    var v = 0.3;
    if(num === '05') v = 0.1;
    
    XPBot.radioCenter.ctrler.playFile({
      guild: guild,
      cnl: radioCnl,
      fileName: 'Jingle-' + num + '.mp3',
      opts: {vol: v}
    });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  //specificAllowed: ['水道局長', 'サーバー所有者', '管理者', 'モデレーター', 'ラジオ放送者'],
  permLevel: "ラジオ放送者"
};

exports.help = {
  name: "radiocmd",
  category: "ラジオ",
  description: "ラジオの運営において、便利なコマンドを実行します。「radiocmd help」で詳細。",
  usage: "radiocmd <サブコマンド名> <サブコマンド引数>"
};
