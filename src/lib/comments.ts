// 源さん（62歳、元サラリーマン、将棋歴40年）のコメントデータ

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours(); // ブラウザのローカル時間
  if (hour >= 5 && hour < 10) {
    // 朝
    return pick([
      'おはよう！朝の一局は頭がスッキリするで',
      '早起きやな！朝のうちに一局やるか',
      'おっ、おはよう。コーヒー入れたとこや',
      '朝の将棋は格別やで。さ、やろか',
    ]);
  } else if (hour >= 10 && hour < 17) {
    // 昼
    return pick([
      'よっ、来たな！ちょうど暇してたんや',
      'いい時間やな。一局いこか',
      'おっ、久しぶり…って昨日も来てたな笑',
      '今日もええ天気や。縁台将棋日和やで',
    ]);
  } else if (hour >= 17 && hour < 22) {
    // 夕方〜夜
    return pick([
      'お疲れさん！仕事帰りか？一局やるか',
      '夕方の将棋もなかなかオツなもんやで',
      'おっ、来たな。晩飯前にサクッと一局？',
      '今日も一日頑張ったやろ。将棋で頭のリセットや',
    ]);
  } else {
    // 深夜
    return pick([
      'おいおい、こんな時間にまだ起きとるんか笑',
      '夜更かしやなぁ。…ワシもやけど',
      '深夜の将棋は不思議と集中できるんよな',
      'シーッ…嫁さんに見つかるで笑',
    ]);
  }
}

export function getReviewComments(playerWon: boolean, moveCount: number): string[] {
  const comments: string[] = [];

  if (playerWon) {
    comments.push(pick([
      'いやー、完敗や。見事やったで',
      'お前さん、だいぶ強なったなぁ',
    ]));
  } else {
    comments.push(pick([
      'ドンマイドンマイ。ワシも最初は負けてばっかやったで',
      '惜しかったなぁ。あとちょっとやったのに',
    ]));
  }

  if (moveCount < 40) {
    comments.push('短い対局やったな。次はもっとじっくり指そか');
  } else if (moveCount > 80) {
    comments.push('長い熱戦やったなぁ！こういう将棋が一番おもろいんや');
  }

  comments.push(pick([
    '将棋はな、負けた時が一番成長するんやで',
    'また明日もやろな。ワシはいつでもここにおるから',
    '今日の一局、ええ勉強になったやろ？',
    'お茶でも飲んでいきぃや',
  ]));

  return comments;
}

// --- 対局開始 ---
const gameStart = [
  'よっ、今日もやるか！さぁ座り座り',
  'おっ、来たな！今日は負けへんで〜',
  'お茶入れたとこや。さ、一局いこか',
  'よう来たな〜。ほな始めよか',
  'おっ、待ってたで！調子はどうや？',
  'さぁさぁ、今日も縁台将棋やで〜',
  'ええ天気やし、一局やろか！',
];

// --- プレイヤーが指した時 ---
const playerMoveGeneral = [
  'ほぉ〜',
  'なるほどなぁ',
  'ふむふむ',
  'ほほぅ',
  'はいはい',
  'ふーん、そうきたか',
  'うんうん',
  'へぇ〜',
];

const playerMoveGood = [
  'おっ、やるやないか！',
  'その手は見えてなかったわ',
  'シブい手やな〜',
  'おぉ〜ええ手やないか',
  'なかなかやるなぁ！',
  'うまいっ！ワシも見習わなあかんな',
  'こりゃ参ったなぁ',
  'ほぉ〜、考えとるねぇ',
];

const playerCapture = [
  'いただきます、っと…って取られたんかいな！',
  'あちゃー取られたわ',
  'おいおい、それ大事にしてたんやで',
  'あーあ、持ってかれたか〜',
  'くぅ〜、痛いとこ突くなぁ',
  'マジか…それ取るか普通',
];

const playerBigPiece = [
  '大駒出してきたな、攻めっ気あるねぇ',
  'おっ、飛車角使いにいくか！',
  'でかいの動かしてきたなぁ',
  '大胆やな〜、嫌いやないで',
  'ここで大駒か…やるなぁ',
];

const playerPawnPush = [
  '歩の突き方で棋力がわかるんやで',
  '歩か…地味やけど大事な一手やな',
  'コツコツいくタイプか、ええぞ',
  '歩突きは将棋の基本や！',
  'じわじわ来るなぁ',
];

// --- AIが指す時 ---
const aiThinking = [
  'うーん...',
  'ちょっと待ってな...',
  'ここは...なるほど',
  'えーっと、どないしよかな...',
  'む、これは悩むなぁ...',
  'ちょい考えさせてな...',
  'ワシの番やな…うーむ',
  'ほな、ワシも考えるで…',
];

const aiMoved = [
  'えいっ',
  'これでどうや？',
  'ここしかないやろ',
  'ほい、ワシはこれや',
  'こんなもんやろ',
  'どや！',
  'ふふ、これや',
  'まぁ、こういう手もあるわな',
  'ほな、ここいっとくか',
];

// --- 王手 ---
const checkGiven = [
  '王手！どうするんや〜',
  '王手やで！逃げられるかな〜？',
  'ほれ、王手！',
  '王手！ここがワシの見せ場や',
];

const checkReceived = [
  'おっと王手か、焦るなぁ',
  'うわっ、王手きたか！',
  'ぬぬ、王手か…ちょい待って',
  'あちゃ〜、王手やんけ！',
  '王手か！やるなぁお前さん',
];

// --- 成り ---
const promoteByAI = [
  'おりゃ！成ったで！',
  '成り！ここからが本番や',
  'ふふ、成らせてもらうで〜',
  'パワーアップや！',
];

const promoteByPlayer = [
  '龍を作られたか…まずいなぁ',
  '成られたか〜、こりゃ厄介やで',
  'うわ、成ってきた。ピンチやな',
  'あかん、成られてもた',
];

// --- 対局終了 ---
const gameEndPlayerWins = [
  '参りました！いや〜今日は完敗や。もう一局やろ？',
  'やられたわ〜。お前さん強いなぁ。もう一回！',
  '参った参った！悔しいから即もう一局や！',
  'うーん、完敗や。でもええ将棋やったわ',
  '負けたわ〜。次こそは！な？',
];

const gameEndAIWins = [
  'やったな！ワシの勝ちや！ま、次があるで',
  'ふっふっふ、まだまだ若いもんには負けへんで〜',
  '勝ったで〜！でもなかなかええ勝負やったわ',
  'ワシの勝ちや！40年の経験をなめたらあかんで',
  'ま、今日はワシに分があったな。もう一局やろ？',
];

// --- ランダムな独り言 ---
const randomMumble = [
  '今日の天気ええなぁ',
  'この前な、孫が来てな…ま、それはええわ',
  '腰痛いなぁ...お、次の手考えなあかん',
  'コーヒーもう一杯いるか？',
  'そういえば昨日のプロ野球見たか？',
  '隣のおっちゃんにも将棋教えたろかな',
  'あ、せんべい食うか？ほれ',
  '最近の若い子はスマホで将棋やるんやな〜',
  '今度の日曜、公園で将棋大会あるらしいで',
  'ワシが若い頃はなぁ…って年寄りの話はええか',
  'この縁台、もう20年使ってるんやで',
  '夕飯なに食おかなぁ…カレーにしよ',
  'あっ、蚊に刺された…痒いなぁ',
  'そうそう、この前テレビで見たんやけどな…ま、ええわ',
];

// --- エクスポート ---

export type CommentType =
  | 'gameStart'
  | 'playerMove'
  | 'playerCapture'
  | 'playerBigPiece'
  | 'playerPawnPush'
  | 'playerMoveGood'
  | 'aiThinking'
  | 'aiMoved'
  | 'checkGiven'
  | 'checkReceived'
  | 'promoteByAI'
  | 'promoteByPlayer'
  | 'gameEndPlayerWins'
  | 'gameEndAIWins'
  | 'randomMumble';

export function getComment(type: CommentType): string {
  switch (type) {
    case 'gameStart': return pick(gameStart);
    case 'playerMove': return pick(playerMoveGeneral);
    case 'playerCapture': return pick(playerCapture);
    case 'playerBigPiece': return pick(playerBigPiece);
    case 'playerPawnPush': return pick(playerPawnPush);
    case 'playerMoveGood': return pick(playerMoveGood);
    case 'aiThinking': return pick(aiThinking);
    case 'aiMoved': return pick(aiMoved);
    case 'checkGiven': return pick(checkGiven);
    case 'checkReceived': return pick(checkReceived);
    case 'promoteByAI': return pick(promoteByAI);
    case 'promoteByPlayer': return pick(promoteByPlayer);
    case 'gameEndPlayerWins': return pick(gameEndPlayerWins);
    case 'gameEndAIWins': return pick(gameEndAIWins);
    case 'randomMumble': return pick(randomMumble);
  }
}

/** 3〜5手に1回、独り言を挟むかどうか */
export function shouldMumble(moveCount: number): boolean {
  if (moveCount < 4) return false;
  if (moveCount % 3 === 0) return Math.random() < 0.5;
  if (moveCount % 5 === 0) return true;
  return Math.random() < 0.15;
}
