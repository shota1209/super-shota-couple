const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const backgroundDiv = document.getElementById("background");

const bgm = document.getElementById("bgm");
bgm.volume = 0.6;
bgm.play().catch(() => {
  console.log("BGMの自動再生はブラウザによって制限されている可能性があります");
});

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

// 背景画像（5つ）
const backgrounds = [
  "images/bg1.png",
  "images/bg2.png",
  "images/bg3.png",
  "images/bg4.png",
  "images/bg5.png"
];
let backgroundIndex = 0;
const bgImage = new Image();
bgImage.src = backgrounds[backgroundIndex];

// 音
const soccerAudio = document.getElementById("soccerAudio");

// キャラ設定
let shota = {
  x: canvas.width / 2,
  y: canvas.height - 160,
  width: 80,
  height: 80,
  vx: 0,
  vy: 0,
  isJumping: false
};

// バラ・ボール設定
let rose = { x: 0, y: 0, width: 40, height: 40, speed: 3 };
let ball = { x: 0, y: 0, width: 40, height: 40, speed: 3 };
resetItem(rose);
resetItem(ball);

// ゲーム設定
const gravity = 0.8;
const jumpPower = -16;
let roseCount = 0;
const maxRoses = 10;

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

function fadeBackground(newIndex) {
  canvas.style.transition = "opacity 0.8s ease";
  canvas.style.opacity = 0;

  setTimeout(() => {
    bgImage.src = backgrounds[newIndex];
    backgroundIndex = newIndex;
    canvas.style.opacity = 1;
  }, 400);
}

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

  [rose, ball].forEach(item => {
    item.y += item.speed;
    if (item.y > canvas.height) resetItem(item);
  });

  if (isColliding(shota, rose)) {
    roseCount++;
    resetItem(rose);

    if (roseCount % 2 === 0 && backgroundIndex < backgrounds.length - 1) {
      fadeBackground(backgroundIndex + 1);
    }

    if (roseCount >= maxRoses) {
      setTimeout(() => {
        window.location.href = "ending.html";
      }, 1500);
    }
  }

  if (isColliding(shota, ball)) {
    resetItem(ball);
    soccerAudio.currentTime = 0;
    soccerAudio.play();
  }
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
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
