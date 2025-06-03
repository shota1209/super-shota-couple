const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 60; // 下の説明エリア分引く
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const shotaImg = new Image();
shotaImg.src = "images/shota.png";

let shotaX = 100;
let shotaY = canvas.height - 120;
let velocityY = 0;
let isJumping = false;

let direction = 0;
let moveInterval = null;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(shotaImg, shotaX, shotaY, 80, 80);
}

function update() {
  shotaX += direction * 5;

  if (isJumping) {
    velocityY += 1;
    shotaY += velocityY;

    if (shotaY >= canvas.height - 120) {
      shotaY = canvas.height - 120;
      velocityY = 0;
      isJumping = false;
    }
  }

  draw();
  requestAnimationFrame(update);
}
update();

function startMove(dir) {
  direction = dir;
  if (!moveInterval) {
    moveInterval = setInterval(() => {}, 100);
  }
}

function stopMove() {
  direction = 0;
  clearInterval(moveInterval);
  moveInterval = null;
}

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const touchX = e.touches[0].clientX;
  const center = window.innerWidth / 2;

  if (touchX < center) {
    startMove(-1);
  } else {
    startMove(1);
  }
});

canvas.addEventListener("touchend", (e) => {
  stopMove();
});

let startY = null;
canvas.addEventListener("touchstart", (e) => {
  startY = e.touches[0].clientY;
});

canvas.addEventListener("touchmove", (e) => {
  const currentY = e.touches[0].clientY;
  if (startY - currentY > 50 && !isJumping) {
    isJumping = true;
    velocityY = -20;
  }
});
