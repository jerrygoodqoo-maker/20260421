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
      speed: random(1, 3)
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

  // 在繪圖層 (pg) 上畫些東西，例如文字或圖案
  pg.clear(); // 清除上一幀的內容

  // 繪製並更新泡泡效果
  pg.noStroke();
  pg.fill(255, 255, 255, 150); // 半透明白色
  for (let b of bubbles) {
    pg.ellipse(b.x, b.y, b.r);
    b.y -= b.speed; // 泡泡向上移動
    
    // 如果泡泡超出頂部，將其重置到底部隨機位置
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
