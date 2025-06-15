const playButton = document.getElementById('playButton');
const videoContainer = document.getElementById('videoContainer');
const iframe = document.getElementById('vimeoPlayer');
const bgm = document.getElementById('bgm');
const whiteOverlay = document.getElementById('whiteOverlay');
const backgroundDiv = document.getElementById('background');
const thanksMessage = document.getElementById('thanks-message');
const futureMessage = document.getElementById('future-message');

let bgmStarted = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 60;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function fadeTransition(callback) {
  // 背景の変更時にフェードアウト
  if (whiteOverlay.classList.contains("visible")) return;
  whiteOverlay.classList.add("visible");
  setTimeout(() => {
    callback();
    setTimeout(() => whiteOverlay.classList.remove("visible"), 600);
  }, 600);
}

// 背景画像の更新
function updateBackground(newSrc) {
  const newImage = new Image();
  newImage.src = newSrc;
  newImage.onload = function() {
    backgroundDiv.style.opacity = 0; // 背景をフェードアウト
    setTimeout(() => {
      backgroundDiv.style.backgroundImage = `url(${newSrc})`;
      backgroundDiv.style.opacity = 1; // 背景をフェードイン
    }, 1000); // 1秒後に背景更新
  };
}

// 10個目のバラを取った後に動画再生ボタンを表示
if (roseCount === 10) {
  finalVoice.play();
  fadeTransition(() => {
    thanksMessage.classList.remove("hidden");
    setTimeout(() => {
      thanksMessage.classList.add("hidden");
      futureMessage.classList.remove("hidden");
      setTimeout(() => {
        futureMessage.classList.add("hidden");
        playButton.style.display = 'block';  // 動画再生ボタンを表示
      }, 4000);  // メッセージを隠す前に4秒待つ
    }, 4000);  // 感謝メッセージ表示後4秒待つ
  });
}

// 動画再生ボタンの処理
playButton.addEventListener('click', () => {
  playButton.style.display = 'none';  // ボタンを非表示
  videoContainer.style.display = 'block';  // 動画を表示
  const player = new Vimeo.Player(iframe);
  player.play();  // 再生
});

function update() {
  // ゲームの更新処理
}

function draw() {
  // ゲームの描画処理
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
