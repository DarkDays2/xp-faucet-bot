const ytdl = require('ytdl-core');
const sendSpam = require('../modules/sendSpam.js');

exports.run = async (XPBot, message, args, level) => {// eslint-disable-line no-unused-vars
  
  message.delete();

  var subCmdName = args.shift();
  
  var radioCnl = message.guild.channels.find(val => {
    return val.type === 'voice' && val.name === args[args.length - 1];
  });
  
  if(!radioCnl){
    radioCnl = message.member.voiceChannel;
  }
  
  var radioChatCnls = {
    'XP_radio802': 'xp_radio802',
    'General': 'general_chat',
    'general2': 'general'
  };
  
  var radioChatCnl = message.guild.channels.find('name', radioChatCnls[radioCnl.name]);

  if(subCmdName == 'bgm'){
    let type = args.shift();
    if(type == 'stop'){
      radioCnl.leave();
    } else if(typeof type === 'undefined'){
      return;
    }
    
    if(type == 'yt'){ // !!radiocmd bgm yt <ID> [cnl]
      let videoId = args.shift();
      let vol = parseFloat(args.shift());
      
      vol = vol ? vol * 0.1 : 0.01;
      
      radioCnl.join().then(async connection => {
        var streamOptions = { seek: 0, volume: vol };
        var stream = ytdl('https://www.youtube.com/watch?v=' + videoId, { filter : 'audioonly' });
        
        await XPBot.wait(80);
        var dispatcher = connection.playStream(stream, streamOptions);

        dispatcher.on('start', async () => {
          await XPBot.wait(1000);
          radioChatCnl.send('BGM: https://www.youtube.com/watch?v=' + videoId);
        });
      });
    } else{
      let filenames = {
        'morning01': 'BGM-Morning01.mp3',
        'techno01': 'BGM-Techno01.mp3',
        'atale': 'A Tale-001b.mp3',
        'akarui1': 'xp_akarui_hourly_loop.mp3',
        'akarui2': 'xp_akarui_2_halfhourly_loop.mp3',
        'wafu': 'xp_wafu_halfhourly_loop.mp3'
      };
      
      let vols = {
        'morning01': 0.3,
        'techno01': 0.3,
        'atale': 0.1,
        'akarui1': 0.04,
        'akarui2': 0.04,
        'wafu': 0.04
      };
      
      //let param = args.shift();
      let name = filenames[type];
      
      //console.log(type);
      
      if(name){
        var vol = vols[type];
        
        radioCnl.join().then(async connection => {
          var streamOptions = { seek: 0, volume: vol };
          //var stream = ytdl('https://www.youtube.com/watch?v=' + videoId, { filter : 'audioonly' });

          await XPBot.wait(80);      
          var dispatcher = connection.playFile("././assets/" + name, streamOptions);

          dispatcher.on('start', async () => {
            await XPBot.wait(1000);
            
            let msgs = {
              'morning01': '',
              'techno01': '',
              'atale': '',
              'akarui1': 'BGM提供: <@390069961340616704>さん',
              'akarui2': 'BGM提供: <@390069961340616704>さん',
              'wafu': 'BGM提供: <@390069961340616704>さん'
            };
            
            if(msgs[type]){
              radioChatCnl.send(msgs[type]);
            }
            
            //radioChatCnl.send('BGM: https://www.youtube.com/watch?v=' + videoId);
          });
        }); 
      }
    }
    
  } else if(subCmdName == 'jingle'){
    let num = ('00' + args.shift().toString()).slice(-2);
    
    radioCnl.join().then(async connection => {
      await XPBot.wait(100);
      var dispatcher = connection.playFile("././assets/jingle" + num + ".mp3", { volume: 0.3 });
      /*dispatcher.on('start', async () => {
        await XPBot.wait(1000);
        radioChatCnl.send('BGM: https://www.youtube.com/watch?v=' + videoId);
      });*/
    });
  } else if(subCmdName == 'help'){
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
          '  atale     - Japaritale\r\n' + 
          '  akarui1   - ひろし氏制作BGM\r\n' + 
          '  akarui2   - ひろし氏制作BGM\r\n' + 
          '  wafu      - ひろし氏制作BGM\r\n' +
          '== !!radiocmd bgm stop ==\r\n' +
          '現在流れているBGM・ジングルを停止させます\r\n\r\n' +
          '== 音量について ==\r\n' + 
          'YouTubeからBGMを再生する場合のみ、音量を指定可能\r\n' + 
          '音量は、0.1倍1が10%、0.1が1%'
        
        break;
        /*let filenames = {
        'morning01': 'BGM-Morning01.mp3',
        'techno01': 'BGM-Techno01.mp3',
        'atale': 'A Tale-001b.mp3',
        'akarui1': 'xp_akarui_hourly_loop.mp3',
        'akarui2': 'xp_akarui_2_halfhourly_loop.mp3',
        'wafu': 'xp_wafu_halfhourly_loop.mp3'
      };*/
      default:
        output += 
          '= radiocmdコマンド ヘルプ =\r\n\r\n' +
          '[!!radiocmd help <サブコマンド名> で詳細表示]\r\n\r\n' + 
          'bgm  :: 音楽を再生します(YouTube/ローカルファイル再生)\r\n' +
          'help :: このヘルプを表示します。\r\n';
        break;
    }
    /*let output = 
        'bgm yt <YouTube動画ID> <音量>   :: YouTubeの動画を再生します(（)著作権に注意)\r\n' +
        'bgm <BGM名> <音量> :: 水道局ローカルに保存されているBGMを再生します(akarui1, akarui2, wafu, morning01, techno01)\r\n' + 
        'help      :: このヘルプを表示します。\r\n';*/
    message.channel.send(output, {code: "asciidoc", split: { char: "\u200b" }});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "ラジオ放送者"
};

exports.help = {
  name: "radiocmd",
  category: "サーバー運営",
  description: "ラジオの運営において、便利なコマンドを実行します。「radiocmd help」で詳細。",
  //description: "lockcnl / unlockcnl: 書き込み制限/解除(先頭に「#」無し/空白でつなげる)",
  usage: "radiocmd <サブコマンド名> <サブコマンド引数>"
};
