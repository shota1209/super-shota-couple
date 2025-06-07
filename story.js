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
  const container = document.querySelector(".story-container");

  // 背景画像・Shota・Kaoruを挿入
  container.innerHTML = `
    <img src="images/romantic-pastel-bg.png" class="background" alt="背景">
    <img src="images/shota.png" class="shota" alt="Shota">
    <img src="images/kaoru.png" class="kaoru" alt="Kaoru">
    <div id="story-text" class="story-text"></div>
  `;

  // セリフ表示処理
  const storyText = document.getElementById("story-text");
  let index = 0;

  function showNextLine() {
    if (index < storyLines.length) {
      storyText.textContent = storyLines[index];
      index++;
      setTimeout(showNextLine, 3500);
    } else {
      setTimeout(() => {
        window.location.href = "game.html";
      }, 3000);
    }
  }

  showNextLine();
};
