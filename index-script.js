window.onload = () => {
  document.body.classList.add('visible');

  // 花びらを生成（20枚）
  setTimeout(() => {
    for (let i = 0; i < 20; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.animationDuration = (5 + Math.random() * 5) + 's';
      petal.style.animationDelay = (Math.random() * 5) + 's';
      document.body.appendChild(petal);
    }
  }, 2000);

  // Shota を登場させる
  setTimeout(() => {
    const shota = document.getElementById('shota');
    shota.style.opacity = 1;
    shota.style.left = '60%';
  }, 6000);

  // タップで story.html にフェードアウト遷移
  document.body.addEventListener('click', () => {
    document.body.style.opacity = 0;
    setTimeout(() => {
      //window.location.href = 'story.html';
      window.location.href = 'story.html';
    }, 1000);
  });
};
