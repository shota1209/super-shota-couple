const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 60;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// 画像読み込み
const shotaImg = new Image();
shotaImg.src = "images/shota.png";

const roseImg = new Image();
roseImg.src = "images/rose.png";

const ballImg = new Image();
ballImg.src = "images/ball.png";

// 背景画像
const backgrounds = [
  "images/bg1.png",
  "images/bg2.png",
  "images/bg3.png",
  "images/bg4.png"
];
let backgroundIndex = 0;
const bgImage = new Image();
bgImage.src = backgrounds[backgroundIndex];

let roseCount = 0;

const soccerAudio = document.getElementById("soccerAudio");

// キャラ状態
let shota = {
  x: canvas.width / 2,
  y: canvas.height - 160,
  width: 80,
  height: 80,
  vx: 0,
  vy: 0,
  isJumping: false
};

// バラ・ボール
let rose = { x: 0, y: 0, width: 40, height: 40, speed: 3 };
let ball = { x: 0, y: 0, width: 40, height: 40, speed: 3 };
resetItem(rose);
resetItem(ball);

// 重力・ジャンプ
const gravity = 0.8;
const jumpPower = -16;

// タッチ操作
let touchStartX = 0;
let touchStartY = 0;
let touchInterval = null;

canvas.addEventListener("touchstart", e => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;

  const center = canvas.width / 2;
  const direction = touchStartX < center ? -1 : 1;

  touchInterval = setInterval(() => {
    shota.vx = 5 * direction;
  }, 16);
}, { passive: true });

canvas.addEventListener("touchmove", e => {
  const touch = e.touches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touchStartY - touch.clientY;

  if (dy > 50 && !shota.isJumping) {
    if (Math.abs(dx) > 30) {
      shota.vx = dx > 0 ? 5 : -5;
    }
    shota.vy = jumpPower;
    shota.isJumping = true;
  }
}, { passive: true });

canvas.addEventListener("touchend", () => {
  clearInterval(touchInterval);
  shota.vx = 0;
}, { passive: true });

function resetItem(item) {
  item.x = Math.random() * (canvas.width - item.width);
  item.y = -Math.random() * canvas.height;
}

function update() {
  shota.x += shota.vx;
  shota.y += shota.vy;
  shota.vy += gravity;

  // 地面処理
  if (shota.y >= canvas.height - shota.height - 60) {
    shota.y = canvas.height - shota.height - 60;
    shota.vy = 0;
    shota.isJumping = false;
  }

  // 画面端制限
  if (shota.x < 0) shota.x = 0;
  if (shota.x > canvas.width - shota.width) shota.x = canvas.width - shota.width;

  [rose, ball].forEach(item => {
    item.y += item.speed;
    if (item.y > canvas.height) resetItem(item);
  });

  // 取得処理
  if (isColliding(shota, rose)) {
    roseCount++;
    resetItem(rose);
    if (roseCount % 3 === 0 && backgroundIndex < backgrounds.length - 1) {
      backgroundIndex++;
      bgImage.src = backgrounds[backgroundIndex];
    }
  }

  if (isColliding(shota, ball)) {
    resetItem(ball);
    soccerAudio.currentTime = 0;
    soccerAudio.play();
  }
}

function isColliding(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function draw() {
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(shotaImg, shota.x, shota.y, shota.width, shota.height);
  ctx.drawImage(roseImg, rose.x, rose.y, rose.width, rose.height);
  ctx.drawImage(ballImg, ball.x, ball.y, ball.width, ball.height);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();
