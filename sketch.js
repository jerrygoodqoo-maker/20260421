let capture;
let pg; // 用於存儲 createGraphics 的圖層
let bubbles = []; // 儲存泡泡的陣列

function setup() {
  // 產生全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 取得攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏 HTML 預設的影片元件，只顯示在畫布上
  capture.hide();
  
  // 初始化一個與初始影片預期大小相同的繪圖層
  pg = createGraphics(windowWidth * 0.6, windowHeight * 0.6);

  // 初始化泡泡數據
  for (let i = 0; i < 50; i++) {
    bubbles.push({
      x: random(pg.width),
      y: random(pg.height),
      r: random(5, 20),
      speed: random(1, 3),
      offset: random(TWO_PI) // 用於產生左右晃動的隨機相位
    });
  }
}

function draw() {
  // 畫布背景顏色設定為 e7c6ff
  background('#e7c6ff');

  // 計算顯示影像的寬高 (整個畫布寬高的 60%)
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  // 計算置中座標
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;

  // 確保繪圖層的大小與視訊畫面一致
  if (pg.width !== floor(videoW) || pg.height !== floor(videoH)) {
    pg = createGraphics(videoW, videoH);
  }

  // 在繪圖層 (pg) 上處理效果
  pg.clear(); // 清除上一幀的內容

  // 繪製並更新冒泡泡效果
  pg.stroke(255, 255, 255, 180); // 泡泡的淡白色邊框
  pg.strokeWeight(1);
  pg.fill(255, 255, 255, 100);    // 半透明白色填充
  for (let b of bubbles) {
    // 結合 sin 函數讓泡泡產生左右搖擺的動態感
    let swayX = b.x + sin(frameCount * 0.05 + b.offset) * 10;
    pg.ellipse(swayX, b.y, b.r);
    
    b.y -= b.speed; // 泡泡向上移動
    
    // 如果泡泡完全超出頂部，則回到下方重新開始
    if (b.y < -b.r) {
      b.y = pg.height + b.r;
      b.x = random(pg.width);
    }
  }

  // 處理鏡像翻轉並繪製影像
  push();
  translate(x + videoW, y); // 移動到顯示區域的右側
  scale(-1, 1);            // 水平反轉
  image(capture, 0, 0, videoW, videoH);
  pop();

  // 將產生的圖層顯示在視訊畫面的上方
  image(pg, x, y);
}

function windowResized() {
  // 視窗大小改變時，重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}
