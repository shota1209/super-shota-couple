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
    overlay.style.display = "none"; // タップで白画面を消す

    setTimeout(() => {
      // BGM 再生
      if (!bgmStarted) {
        bgm.play().catch(() => {});
        bgmStarted = true;
      }

      // 背景とキャラを表示
      const container = document.querySelector(".story-container");
      container.innerHTML = `
        <img src="images/romanticbg.png" class="background" alt="背景">
        <img src="images/shota.png" class="shota" alt="Shota">
        <img src="images/kaoru.png" class="kaoru" alt="Kaoru">
        <div id="story-text" class="story-text"></div>
      `;

      const storyText = document.getElementById("story-text");
      let index = 0;

      function showNextLine() {
        if (index < storyLines.length) {
          const p = document.createElement("p");
          p.textContent = storyLines[index];
          p.classList.add("fade-in");
          storyText.appendChild(p);
          index++;
          setTimeout(showNextLine, 3500);
        } else {
          setTimeout(() => {
            window.location.href = "game.html";
          }, 3000);
        }
      }

      showNextLine();
    }, 1000); // 1秒後に開始
  });
};
