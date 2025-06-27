const bgm = document.getElementById("bgm");
let bgmStarted = false;

const storyLines = [
  "翔太とかおるは2023年、",
  "運命的に出会いました。",
  "",
  "奇跡的に誕生日が",
  "一緒だった2人は、",
  "自然と惹かれ合い、",
  "お付き合いを始めました。",
  "",
  "それから約2年間、",
  "笑ったり、泣いたり、",
  "喧嘩したり...",
  "いろんな事がありました。",
  "",
  "翔太がサッカーに",
  "夢中になりすぎて、",
  "かおるちゃんに",
  "怒られたこともしばしば",
  "",
  "「私は月に2回しか",
  "会ってないけど、",
  "翔太くんは月に8回も",
  "サッカーに行ってる」",
  "……なんてことも、",
  "あったとかなかったとか。",
  "",
  "それでも2人は、支え合い、",
  "ここまで歩いてきました。",
  "",
  "そんな翔太が──今日、",
  "ある決心をしたのです。",
  "",
  "物語の続きを、",
  "どうか見届けてください。"
];

window.onload = () => {
  const overlay = document.getElementById("start-overlay");

  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    startStoryScene(); // ← ちゃんと呼び出し
  });
};

// 🔧 忘れてはいけない！ストーリー開始関数
function startStoryScene() {
  if (!bgmStarted) {
    bgm.play().catch(() => {});
    bgmStarted = true;
  }

  const container = document.querySelector(".story-container");
  container.innerHTML = `
    <img src="images/romantic_bg.png" class="background" alt="背景">
    <img src="images/shota.png" class="shota" alt="Shota">
    <img src="images/kaoru.png" class="kaoru" alt="Kaoru">
    <div id="story-text" class="story-text">
      <div class="scrolling-text">
        ${storyLines.map(line => line === "" ? "<br>" : line + "<br>").join("")}
      </div>
    </div>
  `;

  setTimeout(() => {
    window.location.href = "game.html";
  }, 86000);
}
