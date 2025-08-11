// === 最新版 game.js ===

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const backgroundDiv = document.getElementById("background");
const poemDiv = document.getElementById("poem");
const bgm = document.getElementById("bgm");
const soccerAudio = document.getElementById("soccerAudio");
const garlicAudio = document.getElementById("garlicAudio");
const jumpSound = document.getElementById("jumpSound");
const soccerHappyAudio = document.getElementById("soccer_happy_audio");
const heartsContainer = document.getElementById("hearts");
const roseMessage = document.getElementById("rose-message");
const thanksMessage = document.getElementById("thanks-message");
const futureMessage = document.getElementById("future-message");
const finalVoice = document.getElementById("finalVoice");
const whiteOverlay = document.getElementById("whiteOverlay");
let vimeoPlayer = null;


// 痩せた演出用（非等倍スケール）
let shotaScaleX = 1;
let shotaScaleY = 1;
let shotaSlimActive = false;

// サッカー嬉しさ演出（小さいボールの紙吹雪）
let fxBalls = []; // {x,y,vx,vy,life,rot,alpha}
let fxTexts = []; // {x,y,vy,alpha,text,life}


//バージョンアップ(ケーキと車)
// ケーキ用の音声配列
const cakeAudios = [
  document.getElementById("cake_kaoru"),
  document.getElementById("cake_shota1"),
  document.getElementById("cake_shota2")
];
// ケーキ用の音声配列
const carAudios = [
  document.getElementById("car_kaoru"),
  document.getElementById("car_shota")
];

const playButton = document.getElementById('playButton');
const videoContainer = document.getElementById('videoContainer');
const iframe = document.getElementById('vimeoPlayer');

let bgmStarted = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 60;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// もともとの shotaImg 定義を置き換え
const shotaSmallImg  = new Image(); shotaSmallImg.src  = "images/shota.png";
const shotaMediumImg = new Image(); shotaMediumImg.src = "images/shota_medium.png";
const shotaLargeImg  = new Image(); shotaLargeImg.src  = "images/shota_large.png";

// 今表示中の画像ポインタ
let shotaImg = shotaSmallImg;

const BASE_SHOTA_SIZE = 80;
let shotaSize = "small"; // "small" | "medium" | "large"
const SIZE_MUL = { small: 1.0, medium: 1.2, large: 1.4 };

// バウンス演出用
let shotaAnimScale = 1.0;   // 一時的な拡大/縮小（最終的に1.0へ戻る）
let shotaBobOffsetY = 0;    // 一時的な上下ゆらし
let shotaSizeAnimating = false;

// ★強制サッカー演出用
let specialBallActive = false;
let specialBallStart = 0;

const roseImg = new Image();
roseImg.src = "images/rose.png";
const ballImg = new Image();
ballImg.src = "images/ball.png";
const garlicImg = new Image();
garlicImg.src = "images/garlic.png";
const heartIcon = "images/heart.png";
//バージョンアップ
const carImg = new Image();
carImg.src = "images/car.png";
const cakeImg = new Image();
cakeImg.src = "images/cake.png";

const backgrounds = [
  "images/bg1.png",
  "images/bg2.png",
  "images/bg3.png",
  "images/bg4.png",
  "images/bg5.png"
];

const messages = [
  "付き合ってください",
  "今度はランドも行こ〜",
  "キャンプで寝てごめん",
  "また海外行こ〜",
  "次は諏訪湖の花火だね",
  "そして今日..."
];

const voiceAudios = [
  "audio/rose1.mp3",
  "audio/rose3.mp3",
  "audio/rose5.mp3",
  "audio/rose7.mp3",
  "audio/rose9.mp3"
];

// 背景画像の初期設定
let bgImage = new Image();
bgImage.src = backgrounds[0];  // 初期背景画像を設定
backgroundDiv.style.backgroundImage = `url(${backgrounds[0]})`;  // 初期背景画像を設定
backgroundDiv.style.opacity = 1; // 背景を最初から表示する


const FALL_SPEED = 2.3; // ← 好きな値に。2.0 や 1.0 でもOK
let roseCount = 0;
let rose = { x: 0, y: 0, width: 40, height: 40, speed: FALL_SPEED };
let ball = { x: 0, y: 0, width: 40, height: 40, speed: FALL_SPEED };
let garlic = { x: 0, y: 0, width: 40, height: 40, speed: FALL_SPEED };
let car = { x: 0, y: 0, width: 40, height: 40, speed: FALL_SPEED };
let cake = { x: 0, y: 0, width: 40, height: 40, speed: FALL_SPEED };
resetItem(rose);
resetItem(ball);
resetItem(garlic);
resetItem(cake);
resetItem(car);

let shota = {
  x: canvas.width / 2,
  y: canvas.height - 160,
  width: 80,
  height: 80,
  vx: 0,
  vy: 0,
  isJumping: false
};

applyShotaSize(shotaSize); // ← ここで初期状態を確定（足元基準の補正も入る）

const gravity = 0.8;
const jumpPower = -16;
let touchStartX = 0;
let touchStartY = 0;
let touchInterval = null;

canvas.addEventListener("touchstart", e => {
  e.preventDefault();
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  const center = canvas.width / 2;
  const direction = touchStartX < center ? -1 : 1;
  touchInterval = setInterval(() => {
    shota.vx = 5 * direction;
  }, 16);

  if (!bgmStarted) {
    bgm.play();
    bgmStarted = true;
  }
}, { passive: false });

canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  const touch = e.touches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touchStartY - touch.clientY;
  if (dy > 50 && !shota.isJumping) {
    if (Math.abs(dx) > 30) {
      shota.vx = dx > 0 ? 5 : -5;
    }
    shota.vy = jumpPower;
    shota.isJumping = true;
    jumpSound.currentTime = 0;
    jumpSound.play();
  }
}, { passive: false });

canvas.addEventListener("touchend", () => {
  clearInterval(touchInterval);
  shota.vx = 0;
}, { passive: false });

function isColliding(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function showHearts(count) {
  heartsContainer.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const img = document.createElement("img");
    img.src = heartIcon;
    img.className = "heart-icon";
    heartsContainer.appendChild(img);
  }
}

function showRoseMessage(text) {
  roseMessage.textContent = text;
  roseMessage.classList.add("visible");
  setTimeout(() => roseMessage.classList.remove("visible"), 4000);
}

function createPetal() {
  const petal = document.createElement("img");
  petal.src = "images/petal.png";
  petal.className = "petal";
  petal.style.left = Math.random() * window.innerWidth + "px";
  document.body.appendChild(petal);
  setTimeout(() => petal.remove(), 2000);
}

function createHeartEffect(x, y) {
  // shotaの周りに小さなハートを表示
  for (let i = 0; i < 5; i++) {  // 5個のハートを生成
    const heart = document.createElement("img");
    heart.src = "images/heart.png";
    heart.className = "petal";

    // shotaの周りにハートを配置
    heart.style.left = (x + Math.random() * 40 - 20) + "px";  // shotaの周りにランダム配置
    heart.style.top = (y + Math.random() * 40 - 20) + "px";   // shotaの周りにランダム配置

    document.body.appendChild(heart);

    // 3秒後に削除
    setTimeout(() => heart.remove(), 2000);
  }
}

// 動画再生ボタンの処理
playButton.addEventListener('click', () => {
  videoContainer.style.display = 'block';  // 動画表示

  const player = new Vimeo.Player(iframe);
  player.play().then(() => {
    playButton.style.display = 'none';  // 再生成功後に非表示
  }).catch((error) => {
    console.error('再生エラー:', error);
  });
});


function fadeTransition(callback) {
  if (whiteOverlay.classList.contains("visible")) return;
  whiteOverlay.classList.add("visible");
  setTimeout(() => {
    callback();
    setTimeout(() => whiteOverlay.classList.remove("visible"), 600);
  }, 600);
}

function stopItemsAnimation() {
  rose.speed = 0;
  ball.speed = 0;
  garlic.speed = 0;
  car.speed = 0;
  cake.speed = 0;
}

function resumeItemsAnimation() {
  rose.speed = FALL_SPEED;
  ball.speed = FALL_SPEED;
  garlic.speed = FALL_SPEED;
  car.speed = FALL_SPEED;
  cake.speed = FALL_SPEED;
}

function triggerForcedSoccer() {
  ball.x = Math.random() * (canvas.width - ball.width);
  ball.y = -ball.height;
  ball.speed = 0;              // ← 通常落下は停止（上の特別ロジックで動かす）
  specialBallActive = true;
  specialBallStart = performance.now();
}

//　shotaの画像を変化させる
function applyShotaSize(state) {
  // 画像切替
  if (state === "small") shotaImg = shotaSmallImg;
  if (state === "medium") shotaImg = shotaMediumImg;
  if (state === "large") shotaImg = shotaLargeImg;

  // 幅・高さを段階に合わせて変更（足元基準で位置補正）
  const oldW = shota.width, oldH = shota.height;
  const mul = SIZE_MUL[state];
  const newW = BASE_SHOTA_SIZE * mul;
  const newH = BASE_SHOTA_SIZE * mul;

  // 中心と足元を極力維持
  shota.x += (oldW - newW) / 2; // 横はセンター維持
  shota.y += (oldH - newH);     // 縦は足元維持（yは上基準なので差分を足す）

  shota.width  = newW;
  shota.height = newH;
}

// 痩せた演出：横にキュッ、縦にスッ（0.6秒）
function playSlimEffect(duration = 600) {
  if (shotaSlimActive) return;
  shotaSlimActive = true;
  const start = performance.now();
  (function anim(now) {
    const t = Math.min((now - start) / duration, 1);
    // いったん 0.85x, 1.15y へ細長く → 戻る（easeOut）
    const ease = t * (2 - t);
    const s = Math.sin(ease * Math.PI);
    shotaScaleX = 1 - 0.15 * s;
    shotaScaleY = 1 + 0.15 * s;

    if (t < 1) requestAnimationFrame(anim);
    else {
      shotaScaleX = 1;
      shotaScaleY = 1;
      shotaSlimActive = false;
    }
  })(start);
}

// 小ボール紙吹雪＆テキスト
function spawnSoccerConfetti(cx, cy, count = 12) {
  for (let i = 0; i < count; i++) {
    const ang = (Math.PI * 2 * i) / count + Math.random() * 0.6;
    const spd = 2 + Math.random() * 2.5;
    fxBalls.push({
      x: cx, y: cy,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd - 1.5, // 少し上向き
      rot: Math.random() * Math.PI * 2,
      life: 900, // ms
      alpha: 1
    });
  }
  fxTexts.push({
    x: cx, y: cy - 20, vy: -0.6,
    text: "サッカー行けて嬉しい〜!", alpha: 1, life: 1000
  });
}

// 全アイテム音声を止める（除外対象は止めない）
function stopAllItemAudios(exclude = null) {
  const audios = [
    soccerAudio, garlicAudio,
    ...cakeAudios, ...carAudios
  ];
  audios.forEach(a => {
    if (a !== exclude) {
      try {
        a.pause();
        a.currentTime = 0;
      } catch {}
    }
  });
  isAudioPlaying = false;
}

// 通常アイテムを画面から一旦退避＆停止
function hideRegularItems() {
  stopItemsAnimation();
  [rose, ball, garlic, car, cake].forEach(item => { item.y = -9999; });
}

// 通常アイテムを復帰
function showRegularItems() {
  [rose, ball, garlic, car, cake].forEach(resetItem);
  resumeItemsAnimation();
}

// 2秒後に光るボール投入するシーケンス
function startForcedSoccerSequence() {
  hideRegularItems();
  setTimeout(() => {
    if (!specialBallActive) triggerForcedSoccer(); // 多重防止
  }, 2000);
}

// 光るボールを捕まえたかどうか？
function endSpecialBall(caught) {
  specialBallActive = false;
  resetItem(ball);
  ball.speed = FALL_SPEED;
  showRegularItems();
  // デバッグログ
  // console.log(caught ? "glow ball caught" : "glow ball timeout");
}


// direction: "up" or "down"
function animateShotaSize(direction, duration = 500) {
  if (shotaSizeAnimating) return;
  shotaSizeAnimating = true;

  const start = performance.now();
  const bob = direction === "up" ? -14 : 14; // 上にふわっ/下にふわっ
  const amp = 0.15; // 拡大/縮小の強さ

  (function anim(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = t * (2 - t); // easeOutQuad
    const s = Math.sin(ease * Math.PI);

    // up: 一瞬大きく → 戻る / down: 一瞬小さく → 戻る
    shotaAnimScale = direction === "up" ? 1 + amp * s : 1 - amp * s;
    shotaBobOffsetY = bob * s;

    if (t < 1) {
      requestAnimationFrame(anim);
    } else {
      shotaAnimScale = 1.0;
      shotaBobOffsetY = 0;
      shotaSizeAnimating = false;
    }
  })(start);
}

// 状態遷移 + 演出
function setShotaState(toState, direction) {
  if (shotaSize === toState) return;  // 変化なしならスキップ
  shotaSize = toState;
  applyShotaSize(toState);
  animateShotaSize(direction);
}


function updateBackground(newSrc) {
  const newImage = new Image();
  newImage.src = newSrc;

  // 画像が読み込まれた後、背景を更新
  newImage.onload = function() {
    console.log("背景画像が読み込まれました:", newSrc); // ログを追加
    backgroundDiv.style.opacity = 0;  // フェードアウト
    
     // 一度キャンバスをクリアしてから背景を切り替える
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // キャンバスをクリア

    //　アニメーションを停止
    stopItemsAnimation();
    
    // バラやサッカーボールをリセット
    resetItem(rose);  // バラのリセット
    resetItem(ball);  // サッカーボールのリセット
    resetItem(garlic);  // にんにくのリセット
    resetItem(car);  // 車のリセット
    resetItem(cake);  // ケーキのリセット

    // 背景をフェードインする処理
    setTimeout(() => {
      backgroundDiv.style.backgroundImage = `url(${newSrc})`;
      backgroundDiv.style.opacity = 1;  // フェードイン
  
      // フェードイン後にアニメーションを再開
      setTimeout(() => {
        resumeItemsAnimation();  // アニメーション再開
      }, 1000);  // 1秒後にアニメーションを再開
    }, 1000);  // 背景の切り替えを1秒遅延させてフェードイン
  };  
  newImage.onerror = function() {
    console.error("背景画像の読み込みに失敗しました:", newSrc);
  }
}

// アイテムごとに横位置をランダムにし、縦位置は固定で上部に配置
function resetItem(item) {
  item.x = Math.random() * (canvas.width - item.width);
  item.y = -Math.random() * canvas.height;
}

let isAudioPlaying = false;  // 音声再生中かどうかのフラグ
let isFinalVoicePlaying = false

function update() {
  shota.x += shota.vx;
  shota.y += shota.vy;
  shota.vy += gravity;
  if (shota.y >= canvas.height - shota.height - 60) {
    shota.y = canvas.height - shota.height - 60;
    shota.vy = 0;
    shota.isJumping = false;
  }
  if (shota.x < 0) shota.x = 0;
  if (shota.x > canvas.width - shota.width) shota.x = canvas.width - shota.width;

  // アイテムリセット時に他のアイテムと重ならないようにする
  // 通常アイテム
  [rose, garlic, car, cake].forEach(item => {
    item.y += item.speed;
    if (item.y > canvas.height) resetItem(item);
  });

  // ★サッカーボール：通常時は通常落下、特別時は別制御
  if (!specialBallActive) {
    ball.y += ball.speed;
    if (ball.y > canvas.height) resetItem(ball);
  }

  // ★強制サッカー演出中
  if (specialBallActive) {
    ball.y += FALL_SPEED * 1.8; // 演出用の落下
    if (isColliding(shota, ball)) {
      // 1) ボイス
      soccerHappyAudio.currentTime = 0;
      soccerHappyAudio.play().catch(()=>{});
      // 2) 一気に small へ（演出は "down" と痩せエフェクト）
      if (shotaSize === "large") {
        shotaSize = "small";         // 状態だけ先に確定
        applyShotaSize("small");     // 画像・サイズを即反映（足元基準補正）
        animateShotaSize("down");    // 下方向の“ふわっ”
        playSlimEffect();            // 3) 痩せ演出
      }
      // 4) うれしさ演出（紙吹雪＋テキスト）
      spawnSoccerConfetti(shota.x + shota.width / 2, shota.y);
      
      endSpecialBall(true);  // ← 下の関数で終了一括処理
    }
    if (performance.now() - specialBallStart > 7000) {
      endSpecialBall(false); // ← タイムアウト終了
    }
  }

  // バラを取った時の処理
  if (!specialBallActive && isColliding(shota, rose) && !isAudioPlaying) {
    roseCount++;
    resetItem(rose);
    createHeartEffect(shota.x, shota.y);
    createPetal();
    showHearts(roseCount);
    
    if ([2, 4, 6, 8].includes(roseCount)) {
      const newBackground = backgrounds[roseCount / 2]; // backgrounds[1] => bg2, backgrounds[2] => bg3 ...
      updateBackground(newBackground);
    }

    if ([1, 3, 5, 7, 9].includes(roseCount)) {
      showRoseMessage(messages[(roseCount - 1) / 2]);
      const voice = new Audio(voiceAudios[(roseCount - 1) / 2]);
      voice.play();
      isAudioPlaying = true;  // 音声再生中フラグを立てる

      // 音声再生終了時にフラグをリセット
      voice.onended = () => {
        isAudioPlaying = false;
      };
      // 音声が長い場合にタイムアウトでリセット
      setTimeout(() => {
        if (isAudioPlaying) {
          isAudioPlaying = false;  // 強制的にフラグをリセット
        }
      }, 5000);     
    }

    }
    // 10個目のバラを取った時の処理
    if ([10].includes(roseCount)) {
      // バラとサッカーボールのアニメーションをストップ
      stopItemsAnimation();  // バラとサッカーボールのアニメーションを止める
    
      // 背景を真っ白にフェードアウト
      whiteOverlay.classList.add("visible");  // 白い背景を表示
      backgroundDiv.style.opacity = 0;  // 背景をフェードアウト
      
      // キャンバスを一時的に非表示にする
      canvas.style.display = 'none';  // キャンバスを隠す
    
      // 操作説明とハートUIを非表示にする
      document.getElementById('instructions').style.display = 'none';  // 操作説明を非表示
      heartsContainer.style.display = 'none';  // ハートUIを非表示
      
      // 白背景が表示されてから、感謝メッセージと未来メッセージを表示
      // 白背景が表示されてから、感謝メッセージと未来メッセージを表示
      setTimeout(() => {
        if (!isFinalVoicePlaying) {
          showRoseMessage(messages[5]);
          finalVoice.play(); // 最後のセリフを再生
          isFinalVoicePlaying = true;  // 最後のセリフが再生中フラグを立てる
        }
  
        // 感謝メッセージの表示
        setTimeout(() => {
          // display: blockにして感謝メッセージを表示
          thanksMessage.style.display = 'block';
  
          // さらに数秒後に未来のメッセージ表示
          setTimeout(() => {
            thanksMessage.style.display = 'none';  // 感謝メッセージを非表示
            futureMessage.style.display = 'block'; // 未来のメッセージを表示
  
            // 最後に未来のメッセージが表示された後、動画再生ボタンを表示
            setTimeout(() => {
              futureMessage.style.display = 'none'; // 未来メッセージを非表示
              videoContainer.style.display = 'block';  // 動画表示
              vimeoPlayer = new Vimeo.Player(iframe);
              //playButton.style.display = 'block';  // ボタンを表示
            }, 4000);  // ボタンを表示するタイミング
          }, 4000);  // 感謝メッセージの後に未来のメッセージを表示
        }, 5000); // 感謝メッセージが表示されるまで5秒待つ
      }, 1000); // 白背景の表示後1秒待つ
    }

  // ガーリックを取った時の処理
  if (!specialBallActive && isColliding(shota, garlic) && roseCount < 10 && !isAudioPlaying) {
    garlicAudio.currentTime = 0;
    garlicAudio.play();
    isAudioPlaying = true;  // 音声再生中フラグを立てる
    resetItem(garlic);

    garlicAudio.onended = () => {
      isAudioPlaying = false;
    };
    // 音声が長い場合にタイムアウトでリセット
    setTimeout(() => {
      if (isAudioPlaying) {
        isAudioPlaying = false;  // 強制的にフラグをリセット
      }
    }, 5000);  
  }

  // ボールを取った時の処理
  if (!specialBallActive && isColliding(shota, ball) && roseCount < 10 && !isAudioPlaying) {
    soccerAudio.currentTime = 0;
    soccerAudio.volume = 1;
    soccerAudio.play();
    isAudioPlaying = true;  // 音声再生中フラグを立てる
    resetItem(ball);

    soccerAudio.onended = () => {
      isAudioPlaying = false;
    };

    // shotaサイズを変更する
    // ★サイズDOWN：large→medium→small（smallは変化なし）
    if (shotaSize === "large")       setShotaState("medium", "down");
    else if (shotaSize === "medium") setShotaState("small",  "down");

    // 音声が長い場合にタイムアウトでリセット
    setTimeout(() => {
      if (isAudioPlaying) {
        isAudioPlaying = false;  // 強制的にフラグをリセット
      }
    }, 5000);  
    
  }

  // ケーキを取った時の処理
  // ケーキを取った時の処理
  if (!specialBallActive && isColliding(shota, cake) && roseCount < 10 && !isAudioPlaying) {
    if (shotaSize === "large") {
      const specialAudio = document.getElementById("cake_large_audio");
      stopAllItemAudios(specialAudio);   // ← これだけは止めない
      specialAudio.currentTime = 0;
      specialAudio.play();
      isAudioPlaying = true;
      specialAudio.onended = () => { isAudioPlaying = false; };

      if (!specialBallActive) startForcedSoccerSequence(); // ← 2秒後に光るボール
      resetItem(cake);

    } else {
      const randomAudio = cakeAudios[Math.floor(Math.random() * cakeAudios.length)];
      stopAllItemAudios(randomAudio);    // 他は止める
      randomAudio.currentTime = 0;
      randomAudio.play();
      isAudioPlaying = true;
      randomAudio.onended = () => { isAudioPlaying = false; };

      // サイズUP
      if (shotaSize === "small")       setShotaState("medium", "up");
      else if (shotaSize === "medium") setShotaState("large",  "up");

      resetItem(cake);
    }

    // 保険の解除
    setTimeout(() => { if (isAudioPlaying) isAudioPlaying = false; }, 5000);
  }


  // 車を取った時の処理
  if (!specialBallActive && isColliding(shota, car) && roseCount < 10 && !isAudioPlaying) {
    // ランダムに1つ選ぶ
    const randomAudio = carAudios[Math.floor(Math.random() * carAudios.length)];

    randomAudio.currentTime = 0;
    randomAudio.play();
    isAudioPlaying = true;

    resetItem(car);

    randomAudio.onended = () => {
      isAudioPlaying = false;
    };

    // 音声が長すぎた場合に保険でフラグをリセット
    setTimeout(() => {
      if (isAudioPlaying) {
        isAudioPlaying = false;
      }
    }, 5000);
  }

}

finalVoice.onended = () => {
  isAudioPlaying = false;
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ★ Shota：拡大縮小＆上下バウンド対応描画
  ctx.save();
  ctx.translate(shota.x + shota.width / 2, shota.y + shota.height / 2 + shotaBobOffsetY);
  // 先の“ピョコン”用の等倍スケール × 痩せ演出の非等倍スケールを合成
  ctx.scale(shotaAnimScale * shotaScaleX, shotaAnimScale * shotaScaleY);
  ctx.drawImage(shotaImg, -shota.width / 2, -shota.height / 2, shota.width, shota.height);
  ctx.restore();

  // ★紙吹雪ボール
  for (let i = fxBalls.length - 1; i >= 0; i--) {
    const p = fxBalls[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04;       // ほんの少し重力
    p.rot += 0.1;
    p.life -= 16;
    p.alpha = Math.max(0, p.life / 900);

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    const s = 0.35; // 小さく描く
    ctx.drawImage(ballImg, -ball.width * s / 2, -ball.height * s / 2, ball.width * s, ball.height * s);
    ctx.restore();

    if (p.life <= 0) fxBalls.splice(i, 1);
  }

  // ★テキスト
  ctx.save();
  ctx.font = "bold 24px 'Arial'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = fxTexts.length - 1; i >= 0; i--) {
    const t = fxTexts[i];
    t.y += t.vy;
    t.life -= 16;
    t.alpha = Math.max(0, t.life / 1000);
    ctx.globalAlpha = t.alpha;
    ctx.fillStyle = "rgba(255, 215, 0, 1)"; // ゴールド
    ctx.fillText(t.text, t.x, t.y);
    if (t.life <= 0) fxTexts.splice(i, 1);
  }
  ctx.restore();

  ctx.drawImage(ballImg,   ball.x,   ball.y,   ball.width,   ball.height);
  
  // ★特別ボールのハイライト
  if (specialBallActive) {
    const t = (performance.now() - specialBallStart) / 1000;
    const cx = ball.x + ball.width / 2;
    const cy = ball.y + ball.height / 2;
    const r  = Math.max(ball.width, ball.height) * 0.9 + 6 * Math.sin(t * 6);

    ctx.save();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(255, 215, 0, 0.9)"; // ゴールドっぽい
    ctx.shadowColor = "rgba(255, 215, 0, 0.9)";
    ctx.shadowBlur = 18;
    ctx.globalAlpha = 0.7 + 0.3 * Math.sin(t * 6);

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // そのほかのアイテムは従来通り
  ctx.drawImage(roseImg,   rose.x,   rose.y,   rose.width,   rose.height);
  ctx.drawImage(garlicImg, garlic.x, garlic.y, garlic.width, garlic.height);
  ctx.drawImage(carImg,    car.x,    car.y,    car.width,    car.height);
  ctx.drawImage(cakeImg,   cake.x,   cake.y,   cake.width,   cake.height);
}


function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

window.onload = () => {
  bgm.play();
};

gameLoop();
