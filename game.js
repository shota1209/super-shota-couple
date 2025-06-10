
// 統合版 game.js（演出・BGM・効果音・光・シルエット・字幕・ジャンプ音などすべて対応）

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const backgroundDiv = document.getElementById("background");
const poemDiv = document.getElementById("poem");
const bgm = document.getElementById("bgm");
const soccerAudio = document.getElementById("soccerAudio");
const heartsContainer = document.getElementById("hearts");
const roseMessage = document.getElementById("rose-message");
const instruction = document.getElementById("instructions");

let firstTouch = false;

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
  "次は諏訪湖の花火だね"
];

const voiceAudios = [
  "audio/rose1.mp3",
  "audio/rose3.mp3",
  "audio/rose5.mp3",
  "audio/rose7.mp3",
  "audio/rose9.mp3"
];

let roseCount = 0;
let backgroundIndex = 0;
let bgImage = new Image();
bgImage.src = backgrounds[0];
let rose = { x: 0, y: 0, width: 40, height: 40, speed: 3 };
let ball = { x: 0, y: 0, width: 40, height: 40, speed: 3 };
resetItem(rose);
resetItem(ball);

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
  if (!firstTouch) {
    bgm.play();
    instruction.style.opacity = 0.6;
    firstTouch = true;
  }
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
    new Audio("audio/jump.mp3").play();
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

function createPetal() {
  const petal = document.createElement("img");
  petal.src = "images/petal.png";
  petal.className = "petal";
  petal.style.left = Math.random() * window.innerWidth + "px";
  document.body.appendChild(petal);
  setTimeout(() => petal.remove(), 3000);
}

function createHeartEffect(x, y) {
  for (let i = 0; i < 5; i++) {
    const heart = document.createElement("img");
    heart.src = "images/heart.png";
    heart.className = "petal";
    heart.style.left = x + (Math.random() * 40 - 20) + "px";
    heart.style.top = y + (Math.random() * 40 - 20) + "px";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 3000);
  }
}

function showSilhouette() {
  const s = document.createElement("img");
  s.src = "images/silhouette.png";
  s.className = "silhouette";
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 4000);
}

function createBackgroundParticles() {
  for (let i = 0; i < 30; i++) {
    const star = document.createElement("div");
    star.className = "background-particle";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    document.body.appendChild(star);
  }
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
    createHeartEffect(shota.x, shota.y);
    createPetal();
    showHearts(roseCount);
    if ([1,3,5,7,9].includes(roseCount)) {
      roseMessage.textContent = messages[(roseCount-1)/2];
      roseMessage.classList.add("visible");
      setTimeout(() => roseMessage.classList.remove("visible"), 4000);
      const voice = new Audio(voiceAudios[(roseCount-1)/2]);
      voice.play();
    }
    if ([2,4,6,8].includes(roseCount)) {
      backgroundIndex++;
      backgroundDiv.style.opacity = 0;
      setTimeout(() => {
        bgImage.src = backgrounds[backgroundIndex];
        backgroundDiv.style.backgroundImage = `url(${bgImage.src})`;
        backgroundDiv.style.opacity = 1;
        showSilhouette();
        createBackgroundParticles();
      }, 600);
    }
    if (roseCount === 9) {
      poemDiv.innerText = "次が最後の1輪…";
      poemDiv.style.opacity = 1;
      setTimeout(() => poemDiv.style.opacity = 0, 3000);
    }
    if (roseCount === 10) {
      new Audio("audio/shota_final.mp3").play();
      for (let i = 0; i < 50; i++) setTimeout(createPetal, i * 50);
      poemDiv.innerText = "そして──翔太が決意した瞬間へ…";
      poemDiv.style.opacity = 1;
      setTimeout(() => poemDiv.style.opacity = 0, 4000);
    }
  }

  if (isColliding(shota, ball) && roseCount < 10) {
    soccerAudio.currentTime = 0;
    soccerAudio.play();
    resetItem(ball);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

window.onload = () => {
  createBackgroundParticles();
};

gameLoop();
