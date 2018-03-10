const ytdl = require('ytdl-core');
const sendSpam = require('../modules/sendSpam.js');

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
        output +=
          '= radiocmdコマンド bgmサブコマンド ヘルプ =\r\n' +
          '音楽を再生します(YouTube/ローカルファイル再生)\r\n\r\n' +
          '== !!radiocmd bgm yt <動画ID> <音量> ==\r\n' +
          'YouTubeの動画を再生します(著作権に注意)\r\n' + 
          'https://www.youtube.com/watch?v=<動画ID>\r\n\r\n' + 
          '== !!radiocmd bgm <BGM名> ==\r\n' + 
          'XPFaucet-Botのローカルに保存されているファイルを再生します\r\n' + 
          '  morning01 - No Copyright Sound (YouTubeより)\r\n' + 
          '  techno01  - No Copyright Sound (YouTubeより)\r\n' + 
          '  akarui1   - ひとし氏制作BGM\r\n' + 
          '  akarui2   - ひとし氏制作BGM\r\n' + 
          '  wafu      - ひとし氏制作BGM\r\n' +
          '  izakaya01 - 酒場風BGM\r\n' +
          '  bstheme   - お大事ラジオテーマソング\r\n' +
          '  tan3demo  - でこぽん8848制作BGM\r\n\r\n' +
          '== !!radiocmd bgm pause ==\r\n' +
          '現在流れているBGM・ジングルを一時停止させます\r\n\r\n' +
          '== !!radiocmd bgm resume ==\r\n' +
          '一時停止中のBGM・ジングルを再開させます\r\n\r\n' +
          '== !!radiocmd bgm stop ==\r\n' +
          '現在流れているBGM・ジングルを停止させます\r\n\r\n' +
          '== !!radiocmd bgm vol ==\r\n' +
          '現在の音量を表示します\r\n\r\n' +
          '== !!radiocmd bgm vol <音量> ==\r\n' +
          '音量を変更します (フェード無し)\r\n\r\n' +
          '== !!radiocmd bgm vol <音量> fade <フェードミリ秒> ==\r\n' +
          '音量を変更します (フェードあり)\r\n' +
          'フェード時間はミリ秒(1000分の1秒)で指定します\r\n\r\n' +
          '== 音量について ==\r\n' + 
          'YouTubeからBGMを再生する場合のみ、音量を指定可能\r\n' + 
          '音量は、0.1倍。1が10%、0.1が1%';
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

  var radioCnl = guild.channels.find(val => {
    return val.type === 'voice' && val.name === args[args.length - 1];
  });

  if(!radioCnl){
    if(message.member.voiceChannel) radioCnl = message.member.voiceChannel;
    else return;
  }
  
  let radioChatCnlName = XPBot.getRadioChatCnl(radioCnl);
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
          XPBot.radioCenter.ctrler.setVol(guild, newVol, true, fadeSpan);
        } else{
          XPBot.radioCenter.ctrler.setVol(guild, newVol, false);
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
      let vol = parseFloat(args.shift());

      vol = vol ? vol * 0.1 : 0.01;
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
      let vols = {
        'morning01': 0.3,
        'techno01': 0.3,
        'atale': 0.3,
        'akarui1': 0.04,
        'akarui2': 0.04,
        'wafu': 0.04,
        'izakaya01': 0.07,
        'bstheme': 0.2,
        'tan3demo1': 0.08
      };

      var vol = vols[type];

      //let param = args.shift();

      //console.log(type);

      XPBot.radioCenter.ctrler.playFileAlias({
        guild: guild,
        cnl: radioCnl,
        alias: type,
        opts: {vol: vol},
        funcStart: async () => {
          await XPBot.wait(1000);

          let msgs = {
            'morning01': '',
            'techno01': '',
            'atale': '',
            'akarui1': 'BGM提供: <@390069961340616704>さん',
            'akarui2': 'BGM提供: <@390069961340616704>さん',
            'wafu': 'BGM提供: <@390069961340616704>さん',
            'izakaya01': 'BGM: 「**居酒屋01**」 (<@353169534984912896>)\r\nYouTube: __*Uploading SOON!*__',
            'bstheme': 'BGM: https://www.youtube.com/watch?v=8MtQWSqkwOU',
            'tan3demo1': 'BGM提供: <@391189305604964353>さん'
          };

          if(msgs[type] && radioChatCnl){
            radioChatCnl.send(msgs[type]);
          }
        }
      });
    }

  } else if(subCmdName == 'jingle'){
    let num = ('00' + args.shift().toString()).slice(-2);
    
    XPBot.radioCenter.ctrler.playFile({
      guild: guild,
      cnl: radioCnl,
      fileName: 'Jingle-' + num + '.mp3',
      opts: {vol: 0.3}
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
  //description: "lockcnl / unlockcnl: 書き込み制限/解除(先頭に「#」無し/空白でつなげる)",
  usage: "radiocmd <サブコマンド名> <サブコマンド引数>"
};
