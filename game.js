const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const shotaImg = new Image();
shotaImg.src = 'images/shota.png';

const roseImg = new Image();
roseImg.src = 'images/rose.png';

let shota = { x: 400, y: 500, width: 50, height: 80, vy: 0, jumping: false };
let roses = [];
let collected = 0;
const totalRoses = 15;
const requiredToWin = 10;

function spawnRose() {
  roses.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 30,
    height: 30,
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
  if (shota.jumping) {
    shota.vy += 1; // gravity
    shota.y += shota.vy;
    if (shota.y >= 500) {
      shota.y = 500;
      shota.jumping = false;
    }
  }

  roses.forEach(rose => {
    rose.y += rose.speed;
  });

  // キャッチ判定
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

// 操作
document.getElementById("leftBtn").addEventListener("click", () => {
  shota.x -= 30;
});
document.getElementById("rightBtn").addEventListener("click", () => {
  shota.x += 30;
});
document.getElementById("jumpBtn").addEventListener("click", () => {
  if (!shota.jumping) {
    shota.vy = -20;
    shota.jumping = true;
  }
});

// 2秒ごとにバラ追加
setInterval(spawnRose, 2000);

gameLoop();
