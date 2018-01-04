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
      
      console.log(type);
      
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
    let output = 
        'lockcnl   :: チャンネルの書込を制限します。(チャンネル名は先頭に「#」無し/空白でつなげる)\r\n' +
        'unlockcnl :: チャンネルの書込制限を解除します。(チャンネル名は先頭に「#」無し/空白でつなげる)\r\n' + 
        'stoptype  :: Botのチャンネルでのタイピングを終了します。(チャンネル名は先頭に「#」無し/空白でつなげる)\r\n' + 
        'bal       :: ,balanceを送信します\r\n' + 
        'del       :: メッセージを削除します。(（)メッセージIDを空白でつなげる)\r\n' + 
        'vcin      :: 自分が参加しているボイスチャットに参加します。\r\n' + 
        'vcout     :: 自分が参加しているボイスチャットから退出します。\r\n' + 
        'radio\_jg  :: ジングル・BGMを流します。\r\n' + 
        'help      :: このヘルプを表示します。\r\n';
    //message.channel.send(output, {code: "asciidoc", split: { char: "\u200b" }});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "モデレーター"
};

exports.help = {
  name: "radiocmd",
  category: "サーバー運営",
  description: "ラジオの運営において、便利なコマンドを実行します。「radiocmd help」で詳細。",
  //description: "lockcnl / unlockcnl: 書き込み制限/解除(先頭に「#」無し/空白でつなげる)",
  usage: "radiocmd <サブコマンド名> <サブコマンド引数>"
};
