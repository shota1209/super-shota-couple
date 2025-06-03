// ① キャンバスとコンテキストの取得
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ② キャンバスサイズを画面に合わせる処理
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 60; // 下の説明欄を差し引く
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // 初期化

const shotaImg = new Image();
shotaImg.src = 'images/shota.png';

const roseImg = new Image();
roseImg.src = 'images/rose.png';

let shota = { x: 400, y: 500, width: 75, height: 120, vy: 0, jumping: false };
let roses = [];
let collected = 0;
const totalRoses = 15;
const requiredToWin = 10;

let moveLeft = false;
let moveRight = false;

function spawnRose() {
  roses.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 50,
    height: 50,
    speed: 3 + Math.random() * 2
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(shotaImg, shota.x, shota.y, shota.width, shota.height);

  roses.forEach(rose => {
    ctx.drawImage(roseImg, rose.x, rose.y, rose.width, rose.height);
  });

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`バラ: ${collected}/${requiredToWin}`, 10, 30);
}

function update() {
  if (moveLeft) shota.x -= 5;
  if (moveRight) shota.x += 5;

  if (shota.jumping) {
    shota.vy += 1;
    shota.y += shota.vy;
    if (shota.y >= 500) {
      shota.y = 500;
      shota.jumping = false;
    }
  }

  roses.forEach(rose => {
    rose.y += rose.speed;
  });

  roses = roses.filter(rose => {
    const hit = rose.x < shota.x + shota.width &&
                rose.x + rose.width > shota.x &&
                rose.y < shota.y + shota.height &&
                rose.y + rose.height > shota.y;

    if (hit) collected++;
    return !hit && rose.y < canvas.height;
  });

  if (collected >= requiredToWin) {
    alert("1年半ありがとう\n僕と結婚してください");
    location.reload();
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// 長押し移動
canvas.addEventListener("touchstart", (e) => {
  const x = e.touches[0].clientX;
  if (x < window.innerWidth / 2) {
    moveLeft = true;
  } else {
    moveRight = true;
  }
}, false);

canvas.addEventListener("touchend", () => {
  moveLeft = false;
  moveRight = false;
}, false);

// スワイプでジャンプ
let startY = 0;
canvas.addEventListener("touchstart", (e) => {
  startY = e.touches[0].clientY;
}, { passive: true });

canvas.addEventListener("touchend", (e) => {
  const endY = e.changedTouches[0].clientY;
  if (startY - endY > 50 && !shota.jumping) {
    shota.vy = -20;
    shota.jumping = true;
  }
}, { passive: true });

setInterval(spawnRose, 2000);
gameLoop();
