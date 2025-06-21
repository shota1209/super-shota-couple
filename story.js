const bgm = document.getElementById("bgm");
let bgmStarted = false;

const storyLines = [
  "翔太とかおるは2023年、運命的に出会いました。",
  "奇跡的に誕生日も一緒だった2人は、自然と惹かれ合い、お付き合いを始めました。",
  "それから約2年間、笑ったり、泣いたり、怒ったり──いろんな日々がありました。",
  "翔太がサッカーに夢中になりすぎて、かおるに怒られたこともありました。",
  "「私は月に2回しか会ってないけど、翔太くんは月に8回もサッカーに行ってる」……なんてことも、あったとかなかったとか。",
  "それでも2人は、支え合い、ここまで歩いてきました。",
  "そんな翔太が──今日、ある決心をしたのです。",
  "物語の続きを、どうか見届けてください。"
];

window.onload = () => {
  const overlay = document.getElementById("start-overlay");
  overlay.addEventListener("click", () => {
    overlay.style.display = "none";

    setTimeout(() => {
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
            ${storyLines.join("\n")}
          </div>
        </div>
      `;

      // 60秒後+2秒後にgame.htmlへ遷移
      setTimeout(() => {
        window.location.href = "game.html";
      }, 62000);
    }, 1000);
  });
};

