const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const backgroundDiv = document.getElementById("background");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 60;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// 画像
const shotaImg = new Image();
shotaImg.src = "images/shota.png";

const roseImg = new Image();
roseImg.src = "images/rose.png";

const ballImg = new Image();
ballImg.src = "images/ball.png";

// 背景画像
const backgroundImages = [
  "images/bg1.png",
  "images/bg2.png",
  "images/bg3.png",
  "images/bg4.png",
  "images/bg5.png"
];

let currentBackgroundIndex = 0;
function updateBackground(index) {
  backgroundDiv.style.opacity = 0;
  setTimeout(() => {
    backgroundDiv.style.backgroundImage = `url(${backgroundImages[index]})`;
    backgroundDiv.style.opacity = 1;
  }, 400);
}
updateBackground(0);

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

// バラ状態
let rose = {
  x: Math.random() * (canvas.width - 40),
  y: -40,
  width: 40,
  height: 40,
  speed: 3
};

let roseCount = 0;

// ジャンプ処理
const gravity = 0.8;
const jumpPower = -16;

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
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touchStartY - touch.clientY;

  if (deltaY > 50 && Math.abs(deltaX) > 30 && !shota.isJumping) {
    shota.vx = deltaX > 0 ? 3 : -3;
    shota.vy = jumpPower;
    shota.isJumping = true;
  } else if (deltaY > 50 && !shota.isJumping) {
    shota.vy = jumpPower;
    shota.isJumping = true;
  }
}, { passive: true });

canvas.addEventListener("touchend", () => {
  clearInterval(touchInterval);
  shota.vx = 0;
}, { passive: true });

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

  rose.y += rose.speed;
  if (rose.y > canvas.height) {
    rose.x = Math.random() * (canvas.width - rose.width);
    rose.y = -40;
  }

  // 衝突判定
  if (
    shota.x < rose.x + rose.width &&
    shota.x + shota.width > rose.x &&
    shota.y < rose.y + rose.height &&
    shota.y + shota.height > rose.y
  ) {
    roseCount++;
    rose.x = Math.random() * (canvas.width - rose.width);
    rose.y = -40;

    if (roseCount % 2 === 0 && roseCount / 2 < backgroundImages.length) {
      currentBackgroundIndex = roseCount / 2;
      updateBackground(currentBackgroundIndex);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(shotaImg, shota.x, shota.y, shota.width, shota.height);
  ctx.drawImage(roseImg, rose.x, rose.y, rose.width, rose.height);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
