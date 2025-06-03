const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 60; // 説明欄の高さ
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// 画像読み込み
const shotaImg = new Image();
shotaImg.src = "images/shota.png";

const roseImg = new Image();
roseImg.src = "images/rose.png";

// キャラの状態
let shota = {
  x: canvas.width / 2,
  y: canvas.height - 160,
  width: 80,
  height: 80,
  vx: 0,
  vy: 0,
  isJumping: false
};

// バラの状態
let rose = {
  x: Math.random() * (canvas.width - 40),
  y: -40,
  width: 40,
  height: 40,
  speed: 3
};

// ジャンプ処理
const gravity = 0.8;
const jumpPower = -16;

// タッチ操作の制御
let touchStartX = 0;
let touchStartY = 0;
let touchInterval = null;

canvas.addEventListener("touchstart", e => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;

  const center = canvas.width / 2;
  const direction = touchStartX < center ? -1 : 1;

  // 長押しで移動
  touchInterval = setInterval(() => {
    shota.vx = 5 * direction;
  }, 16);
}, { passive: true });

canvas.addEventListener("touchmove", e => {
  const touch = e.touches[0];
  const deltaY = touchStartY - touch.clientY;

  if (deltaY > 50 && !shota.isJumping) {
    shota.vy = jumpPower;
    shota.isJumping = true;
  }
}, { passive: true });

canvas.addEventListener("touchend", () => {
  clearInterval(touchInterval);
  shota.vx = 0;
}, { passive: true });

// 更新処理
function update() {
  // キャラの移動
  shota.x += shota.vx;
  shota.y += shota.vy;
  shota.vy += gravity;

  // 地面
  if (shota.y >= canvas.height - shota.height - 60) {
    shota.y = canvas.height - shota.height - 60;
    shota.vy = 0;
    shota.isJumping = false;
  }

  // 左右画面端制限
  if (shota.x < 0) shota.x = 0;
  if (shota.x > canvas.width - shota.width) shota.x = canvas.width - shota.width;

  // バラの移動
  rose.y += rose.speed;

  // バラが下に到達したら再出現
  if (rose.y > canvas.height) {
    rose.x = Math.random() * (canvas.width - rose.width);
    rose.y = -40;
  }

  // キャラとバラの当たり判定
  if (
    shota.x < rose.x + rose.width &&
    shota.x + shota.width > rose.x &&
    shota.y < rose.y + rose.height &&
    shota.y + shota.height > rose.y
  ) {
    // バラ取得 → 上から再出現
    rose.x = Math.random() * (canvas.width - rose.width);
    rose.y = -40;
  }
}

// 描画処理
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // キャラ描画
  ctx.drawImage(shotaImg, shota.x, shota.y, shota.width, shota.height);

  // バラ描画
  ctx.drawImage(roseImg, rose.x, rose.y, rose.width, rose.height);
}

// メインループ
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
