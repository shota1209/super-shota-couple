// === 最新版 game.js ===

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const backgroundDiv = document.getElementById("background");
const poemDiv = document.getElementById("poem");
const bgm = document.getElementById("bgm");
const soccerAudio = document.getElementById("soccerAudio");
const garlicAudio = document.getElementById("garlicAudio");
const jumpSound = document.getElementById("jumpSound");
const heartsContainer = document.getElementById("hearts");
const roseMessage = document.getElementById("rose-message");
const thanksMessage = document.getElementById("thanks-message");
const futureMessage = document.getElementById("future-message");
const finalVoice = document.getElementById("finalVoice");
const whiteOverlay = document.getElementById("whiteOverlay");

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

const shotaImg = new Image();
shotaImg.src = "images/shota.png";
const roseImg = new Image();
roseImg.src = "images/rose.png";
const ballImg = new Image();
ballImg.src = "images/ball.png";
const garlicImg = new Image();
garlicImg.src = "images/garlic.png";
const heartIcon = "images/heart.png";

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


let roseCount = 0;
let rose = { x: 0, y: 0, width: 40, height: 40, speed: 3 };
let ball = { x: 0, y: 0, width: 40, height: 40, speed: 3 };
let garlic = { x: 0, y: 0, width: 40, height: 40, speed: 3 };
resetItem(rose);
resetItem(ball);
resetItem(garlic);

let shota = {
  x: canvas.width / 2,
  y: canvas.height - 160,
  width: 80,
  height: 80,
  vx: 0,
  vy: 0,
  isJumping: false
};

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
}

function resumeItemsAnimation() {
  rose.speed = 3;
  ball.speed = 3;
  garlic.speed = 3;
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


// 動画再生ボタンの処理
playButton.addEventListener('click', () => {
  playButton.style.display = 'none';  // ボタンを非表示
  videoContainer.style.display = 'block';  // 動画を表示
  const player = new Vimeo.Player(iframe);
  player.play();
});

// アイテムごとに横位置をランダムにし、縦位置は固定で上部に配置
function resetItem(item) {
  item.x = Math.random() * (canvas.width - item.width);
  item.y = -Math.random() * canvas.height;
}

let isAudioPlaying = false;  // 音声再生中かどうかのフラグ

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
  [rose, ball,garlic].forEach(item => {
    item.y += item.speed;
    if (item.y > canvas.height) resetItem(item);
  });

  // バラを取った時の処理
  if (isColliding(shota, rose) && !isAudioPlaying) {
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
      }, 4000);     
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
      setTimeout(() => {
        showRoseMessage(messages[5]);
        finalVoice.play(); // 最後のセリフを再生
    
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
              playButton.style.display = 'block';  // ボタンを表示
            }, 4000);  // ボタンを表示するタイミング
          }, 4000);  // 感謝メッセージの後に未来のメッセージを表示
        }, 7000); // 感謝メッセージが表示されるまで7秒待つ
      }, 1000); // 白背景の表示後1秒待つ
    }


  // ボールを取った時の処理
  if (isColliding(shota, ball) && roseCount < 10 && !isAudioPlaying) {
    soccerAudio.currentTime = 0;
    soccerAudio.volume = 1;
    soccerAudio.play();
    isAudioPlaying = true;  // 音声再生中フラグを立てる
    resetItem(ball);

    soccerAudio.onended = () => {
      isAudioPlaying = false;
    };
    // 音声が長い場合にタイムアウトでリセット
    setTimeout(() => {
      if (isAudioPlaying) {
        isAudioPlaying = false;  // 強制的にフラグをリセット
      }
    }, 4000);  
    
  }

  // ガーリックを取った時の処理
  if (isColliding(shota, garlic) && roseCount < 10 && !isAudioPlaying) {
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
    }, 4000);  
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(shotaImg, shota.x, shota.y, shota.width, shota.height);
  ctx.drawImage(roseImg, rose.x, rose.y, rose.width, rose.height);
  ctx.drawImage(ballImg, ball.x, ball.y, ball.width, ball.height);
  ctx.drawImage(garlicImg, garlic.x, garlic.y, garlic.width, garlic.height);
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
