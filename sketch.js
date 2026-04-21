let capture;
let pg; // 用於存儲 createGraphics 的圖層
let bubbles = []; // 儲存泡泡的陣列
let saveBtn; // 儲存按鈕物件

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

  // 建立按鈕
  saveBtn = createButton('儲存截圖 (JPG)');
  saveBtn.mousePressed(saveImage);
  updateButtonPosition();
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

  // 處理鏡像翻轉
  push();
  translate(x + videoW, y); // 移動到顯示區域的右側
  scale(-1, 1);            // 水平反轉

  // 馬賽克與黑白化處理
  capture.loadPixels();
  let unitSize = 20; // 每個單位的寬高

  if (capture.pixels.length > 0) {
    // 遍歷攝影機影像的像素
    for (let cy = 0; cy < capture.height; cy += unitSize) {
      for (let cx = 0; cx < capture.width; cx += unitSize) {
        // 取得該單位左上角像素的顏色 (也可以取中心點)
        let index = (cx + cy * capture.width) * 4;
        let r = capture.pixels[index];
        let g = capture.pixels[index + 1];
        let b = capture.pixels[index + 2];

        // 計算平均值取得黑白數值
        let avg = (r + g + b) / 3;

        // 設定填充顏色為黑白，並繪製單位矩形
        fill(avg);
        noStroke();
        
        // 將攝影機座標映射到畫布顯示的大小
        let dx = map(cx, 0, capture.width, 0, videoW);
        let dy = map(cy, 0, capture.height, 0, videoH);
        let dw = map(unitSize, 0, capture.width, 0, videoW);
        let dh = map(unitSize, 0, capture.height, 0, videoH);
        
        rect(dx, dy, dw, dh);
      }
    }
  }
  pop();

  // 將產生的圖層顯示在視訊畫面的上方
  image(pg, x, y);
}

function windowResized() {
  // 視窗大小改變時，重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
  updateButtonPosition();
}

// 更新按鈕位置，使其保持在視訊畫面下方
function updateButtonPosition() {
  let videoH = height * 0.6;
  let y = (height - videoH) / 2;
  // 將按鈕放在視訊畫面下方 20 像素處，並水平置中
  saveBtn.position(width / 2 - saveBtn.width / 2, y + videoH + 20);
}

// 執行截圖並儲存
function saveImage() {
  let videoW = width * 0.6;
  let videoH = height * 0.6;
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;
  
  // 抓取畫布上視訊區域的影像內容
  let img = get(x, y, videoW, videoH);
  save(img, 'my_mosaic_art.jpg');
}
