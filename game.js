const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const backgroundDiv = document.getElementById("background");
const poemDiv = document.getElementById("poem");
const bgm = document.getElementById("bgm");
const soccerAudio = document.getElementById("soccerAudio");
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
}

function resumeItemsAnimation() {
  rose.speed = 3;
  ball.speed = 3;
}

function updateBackground(newSrc) {
  const newImage = new Image();
  newImage.src = newSrc;
  newImage.onload = function() {
    backgroundDiv.style.opacity = 0;
    setTimeout(() => {
      backgroundDiv.style.backgroundImage = `url(${newSrc})`;
      backgroundDiv.style.opacity = 1;
    }, 1000);
  };
}

if ([2, 4, 6, 8, 10].includes(roseCount)) {
  backgroundIndex++;
  stopItemsAnimation();
  fadeTransition(() => {
    const newSrc = backgrounds[backgroundIndex];
    updateBackground(newSrc);
  });
  setTimeout(resumeItemsAnimation, 1200);
}

if (roseCount === 10) {
  finalVoice.play();
  fadeTransition(() => {
    thanksMessage.classList.remove("hidden");
    setTimeout(() => {
      thanksMessage.classList.add("hidden");
      futureMessage.classList.remove("hidden");
      setTimeout(() => {
        futureMessage.classList.add("hidden");
        playButton.style.display = 'block';  // ボタンを表示
      }, 4000);
    }, 4000);
  });
}

// 動画再生ボタンの処理
playButton.addEventListener('click', () => {
  playButton.style.display = 'none';  // ボタンを非表示
  videoContainer.style.display = 'block';  // 動画を表示
  const player = new Vimeo.Player(iframe);
  player.play();
});

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

    if ([1, 3, 5, 7, 9].includes(roseCount)) {
      showRoseMessage(messages[(roseCount - 1) / 2]);
      const voice = new Audio(voiceAudios[(roseCount - 1) / 2]);
      voice.play();
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
  bgm.play();
};

gameLoop();  // ゲームループ開始
