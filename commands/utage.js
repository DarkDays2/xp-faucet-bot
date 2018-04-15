exports.run = async (XPBot, message, args, level) => { // eslint-disable-line no-unused-vars
  message.delete();
  mes = [
    '【元祖】\r\n、、、ん！？　そうか！そこで__**Monacoin**__か！！',
    '【01】\r\nutage = Tokyo(福岡) = :muscle::seedling::fire:\r\n:congratulations:SimplePOSPool:muscle:対応',
    '【02】\r\nutage「flacさぁ～ん」\r\n:bank::bank:バンクエラ:bank::bank:',
    '【03】\r\nうたげ棒企画の発案者は実はumai\r\nI am シャイボーイ',
    '【04】\r\nうたげ棒企画の発案者は実はumai\n「胸がきゅっとなります」\nチョコレートの話は甘くて苦いマーマレードみたいですね',
    '【新01】\r\nutage「このラジオ（のキャラ）がmacchasubさんだったんですか」',
    '【新02】\r\nutage「脳内で済ませればホワイトペーパー」',
    '【新03】\r\nutage「女装は__まだ__目覚めてない」',
    '【新04】\r\n**RESET! 止まってutage!**',
    '【伝説1】\r\nutage「二人で七並べ誘われたらプロポーズかなっておもう」',
    '【伝説2】\r\nutage「踊りたい雨の中で\r\n強く抱きしめるよ」',
    '【勘違い1】\r\n~~ショーツ食べに行こう！~~ ショーツは外してｗｗ', 
    '【川柳1】\r\n愛のPoS　君への重い　coinday'
  ];
  message.channel.send(mes.random())
  //message.channel.send('現在停止中')
    .then(m => m.delete(30000))
    .catch(e => {
    if(e.code === 10008) XPBot.log('Utage', 'メッセージは既に削除されています: ' + e.path, 'ERR');
    else console.error(e);
  });
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['うたげ', 'ウタゲ'],
  permLevel: "一般利用者"
};

exports.help = {
  name: "utage",
  category: "ネタ",
  description: "utage (3月25日現在)",
  usage: "utage"
};
