// このスクリプトは、ゲーム演出のすべての機能（1〜12）を統合するベースコードです

// 1. 花びらが舞う演出
function spawnPetals() {
  for (let i = 0; i < 10; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), 5000);
  }
}

// 2. 翔太に光のエフェクト（ハート）
function showShotaEffect(x, y) {
  const effect = document.createElement("div");
  effect.className = "shota-heart";
  effect.style.left = `${x}px`;
  effect.style.top = `${y}px`;
  document.body.appendChild(effect);
  setTimeout(() => effect.remove(), 1500);
}

// 3. 背景切替時のポエム表示
function showPoem(text) {
  const poem = document.createElement("div");
  poem.className = "poem";
  poem.textContent = text;
  document.body.appendChild(poem);
  setTimeout(() => poem.remove(), 4000);
}

// 4. 星空＆ラスト前演出
function triggerFinalSky() {
  document.body.classList.add("starry");
  showPoem("次が最後のバラ…");
}

// 5. ハートが貯まるUI
function updateHeartUI(count) {
  const container = document.getElementById("heart-container");
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("img");
    heart.src = "images/heart.png";
    heart.className = "heart-icon";
    container.appendChild(heart);
  }
}

// 6. 効果音「ピョン♪」
function playJumpSound() {
  const sound = document.getElementById("jumpSound");
  if (sound) sound.play();
}

// 7. ハートの軌跡（バラ取得時）
function spawnHeartTrail(x, y) {
  for (let i = 0; i < 5; i++) {
    const h = document.createElement("div");
    h.className = "heart-trail";
    h.style.left = `${x + Math.random() * 40 - 20}px`;
    h.style.top = `${y + Math.random() * 40 - 20}px`;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1500);
  }
}

// 8. 背景の光パーティクル
function createBackgroundParticles() {
  for (let i = 0; i < 30; i++) {
    const star = document.createElement("div");
    star.className = "background-particle";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    document.body.appendChild(star);
  }
}

// 9. 翔太の声
function playFinalVoice() {
  const voice = document.getElementById("finalVoice");
  if (voice) voice.play();
}

// 10. 2人のシルエット出現
function showSilhouette() {
  const s = document.createElement("div");
  s.className = "silhouette";
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 4000);
}

// 11. メッセージ表示（字幕）
function showRoseMessage(text) {
  const m = document.getElementById("rose-message");
  m.textContent = text;
  m.classList.add("visible");
  setTimeout(() => m.classList.remove("visible"), 4000);
}

// 12. バラの雨（10個目）
function roseRain() {
  for (let i = 0; i < 50; i++) {
    const r = document.createElement("div");
    r.className = "rose-drop";
    r.style.left = `${Math.random() * 100}%`;
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 5000);
  }
}

// 追加CSS・HTML要素は別途 game.css, game.html 側に設置してください。
// イベントはバラ取得処理などの中で適宜これらの関数を呼び出してください。
