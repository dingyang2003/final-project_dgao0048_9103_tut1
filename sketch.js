const DESIGN_H = 800;
const DESIGN_W = 600;

let branches = [];
let apples = [];
let fireflies = [];
let darkParticles = [];
let smokeParticles = [];
let rainDrops = [];

let noisePoints = [];

let isNight = false;
let isUpsideDown = false;
let isRaining = false;
let isSmoke = false;

let gravity = 0.2;
let gravityDirection = 1;
let ground = 750;
let topY = 20;

let scaleFactor;
let flipAngle = 0;
let targetAngle = 0;

const RAIN_BTN_W = 120;
const RAIN_BTN_H = 40;
const SMOKE_BTN_W = 150;
const SMOKE_BTN_H = 40;

// Rain drop

class RainDrop {
  constructor() {
    this.x = random(0, DESIGN_W);
    this.y = random(-200, 0);
    this.len = random(8, 15);
  }
update() {
    this.y += this.speed;
    if (this.y > DESIGN_H) {
      this.y = random(-100, 0);
      this.x = random(0, DESIGN_W);
    }
  }
draw() {
    stroke(200, 200, 255, 150);
    strokeWeight(2);
    line(this.x, this.y, this.x, this.y + this.len);
}
  }

// Tree Segment

  class Segment{
  constructor(x,y,length,angle,level){
    this.x = x;
    this.y = y;
    this.length = length;
    this.level = level;

    this.angle = angle + random(-0.15, 0.15);

    this.thickness = [0, 15, 10, 7, 5][level] || 4;

    this.swayAmp = random(1, 2);
    this.swaySpeed = random(0.15, 0.2);
    
    this.x2 = x + cos(this.angle) * length;
    this.y2 = y - sin(this.angle) * length;
  }

  draw(){
    stroke(isUpsideDown ? 40 : 0);
    strokeWeight(this.thickness);
    
    let sway = 0;

    if (isUpsideDown) {
      sway = sin(frameCount * this.swaySpeed + this.y * 0.08) * this.swayAmp;
    }

    let nx = this.x + cos(this.angle + radians(sway)) * this.length;
    let ny = this.y - sin(this.angle + radians(sway)) * this.length;

     line(this.x, this.y, nx, ny);
  }
}

// Apple

class Apple {
  constructor(x,y,color){
    this.stratX = x;
    this.stratY = y;
    this.x = x;
    this.y = y;
    this.color = color;

    this.dropSpeed = 0;
    this.state = "waiting";
    this.timer = 0; 

    this.swayRate = random(1, 3);    
    this.swaySpeed = random(0.5, 0.3); 
    this.swayPhase = random(0, TWO_PI); 
  }  

  reset() {
    this.x = this.stratX;
    this.y = this.stratY;
    this.dropSpeed = 0;
    this.state = "waiting";
    this.timer = 0;
  }

  update() {
    if (this.state ==="waiting"){
      this.timer++;
      if(this.timer > 120) this.state = "falling";
  } else if (this.state ==="falling") {
      this.dropSpeed += gravity * gravityDirection;
      this.y += this.dropSpeed;
    
    if(gravityDirection === 1 && this.y >= ground) {
      this.y = ground;
      this.state = "landed";
    } else if (gravityDirection === -1 && this.y <=topY) {
      this.y = topY;
      this.state = "landed";
    }
  } else if (this.state === "landed"){
        this.timer++;
        if(this.timer > 120) this.reset();
  }
}

  
  draw() {
     if (!isUpsideDown && isNight) {
      drawingContext.shadowBlur = 25;
      drawingContext.shadowColor = color(255, 220, 150);
    } else {
      drawingContext.shadowBlur = 0;
    }

    if (isUpsideDown) {
      fill(140 + sin(frameCount * 0.15) * 20, 0, 100);
    } else {
      fill(this.color);
    }

    stroke(0);

    let dx = this.x;
    let dy = this.y;

    if (this.state === "waiting") {
      dx += sin(frameCount * this.swaySpeed + this.swayPhase) * this.swayRate;
    }
     
      ellipse(dx, dy, 40, 40);
  }
}

// Firefly

class Firefly {
  constructor() {
    this.x = random(50, DESIGN_W - 50);
    this.y = random(100, 600);
    this.tw = random(0.02, 0.05);
  }
  update() {
    this.alpha = 150 + sin(frameCount * this.tw) * 100;
    this.y += sin(frameCount * this.tw) * 0.3;
  }
  draw() {
    noStroke();
    fill(255, 210, 80, this.alpha); 
    ellipse(this.x, this.y, 7, 7);
  }
}

// Dark Particles

class DarkParticle {
  constructor() {
    this.x = random(0, DESIGN_W);
    this.y = random(350, 750);
    this.alpha = random(50, 120);
    this.size = random(4, 10);
    this.tw = random(0.03, 0.06);
  }
  update() {
    this.y += sin(frameCount * this.tw) * 0.4;
    if (this.y < 350) this.y = 750;
    if (this.y > 750) this.y = 350;
  }
  draw() {
    noStroke();
    fill(120, 0, 140, this.alpha);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

// Smoke

class SmokeParticle {
  constructor() {
    this.x = random(50, DESIGN_W - 50);
    this.y = random(500, 750);
    this.size = random(20, 45);
    this.alpha = random(40, 90);
    this.speed = random(0.2, 0.6);
    this.xSpeed = random(-0.3, 0.3);
  }

  update() {
    this.y -= this.speed;
    this.x += this.xSpeed;
    this.alpha -= 0.2;

    if (this.alpha <= 0) {
      this.x = random(50, DESIGN_W - 50);
      this.y = random(650, 750);
      this.alpha = random(50, 100);
    }
  }

  draw() {
    noStroke();
    fill(180, 120, 200, this.alpha);
    ellipse(this.x, this.y, this.size, this.size * 0.7);
  }
}

// Tree generator

function generateTree(x, y, length, angle, level) {
  if (length < 40) return;
  
  let b = new Segment(x, y, length, angle, level);
  branches.push(b);

  let endX = branch.x2;
  let endY = branch.y2;

  let offset = level === 1 ? radians(25) : radians(35);
  let left = angle + offset;
  let right = angle - offset;
  
  if (level >= 3 && random()<0.3) {
     apples.push(new Apple(
      lerp(b.x, b.x2, random(0.3, 0.9)),
      lerp(b.y, b.y2, random(0.3, 0.9)),
      random([
        [240, 70, 70],
        [240, 140, 60],
        [210, 100, 150]
      ])
    ));
  }
  
  generateTree(endX, endY, length* 0.75, left, level + 1);
  generateTree(endX, endY, length* 0.75, right, level + 1);
}

function addRandomApple() {
  if (branches.length === 0) return;
  let candidates = branches.filter(b => b.level >= 3);
  if (candidates.length === 0) candidates = branches;
  let b = random(candidates);
  let t = random(0.3, 0.9);
  let ax = lerp(b.x, b.x2, t);
  let ay = lerp(b.y, b.y2, t);
  apples.push(new Apple(
    ax, ay,
    random([
      [240, 70, 70],
      [240, 140, 60],
      [210, 100, 150]
    ])
  ));
}

// Setup

function setup() {
  createCanvas(windowWidth, windowHeight); 
  calcScaleFactor();

  for (let i = 0; i < 800; i++) {
    noisePoints.push({
      x: random(-800, DESIGN_W + 800),
      y: random(0, 650),
      c:[random(100,180), random(150,200), random(200,255), random(80,150)]
    });
  }

  generateTree(300, 650, 200, PI / 2, 1);

   for (let i = 0; i < 40; i++) fireflies.push(new Firefly());
  for (let i = 0; i < 80; i++) darkParticles.push(new DarkParticle());
}

// Draw

function draw() {

   if (!isUpsideDown) {
    background(isNight ? color(20,30,60) : color(110,160,220));
  } else {
    let t = frameCount * 0.01;
    let r = 25 + sin(t) * 20;
    let g = 10 + sin(t * 1.3) * 10;
    let b = 40 + cos(t * 0.7) * 25;
    background(r, g, b);
  }

   if (!isNight && !isUpsideDown) {
    if (apples.length < 40) {
      addRandomApple();
    }
  }
  
  push();
  scale(scaleFactor);
  translate((width / scaleFactor - DESIGN_W) / 2,
            (height / scaleFactor - DESIGN_H) / 2);
  
  translate(DESIGN_W / 2, DESIGN_H / 2);
  rotate(flipAngle);
  translate(-DESIGN_W / 2, -DESIGN_H / 2);

  if (isUpsideDown) {
    for (let d of darkParticles) { d.update(); d.draw(); }
    if (isSmoke) {
      for (let s of smokeParticles) { s.update(); s.draw(); }
    }
  }

  for (let p of noisePoints){
    fill(isUpsideDown ? color(80,0,120,50) : p.c);
    rect(p.x, p.y, 100, 2);
  }

  fill(isUpsideDown ? color(70,90,80) : color(40,140,90));
  rect(0, 650, 600, 100);

  stroke(0);
  strokeWeight(5);
  noFill();
  rect(0,650,600,100);
  noStroke();

  fill(isUpsideDown ? color(150,120,40) : color(240,210,60));
  stroke(0);
  strokeWeight(10);
  rect(125,625,350,75);
  noStroke();

  branches.forEach(b => b.draw());
  apples.forEach(a => { a.update(); a.draw(); });

  if (!isUpsideDown && isNight) {
    fill(255,255,200,90);
    ellipse(500, 120, 80, 80);
    fireflies.forEach(f => { f.update(); f.draw(); });
  }

  if (isRaining && !isUpsideDown) {
    for (let r of rainDrops) { r.update(); r.draw(); }
  }

  pop();

  flipAngle = lerp(flipAngle, targetAngle, 0.08);

   drawUI();
}

function drawUI() {
  push();
  resetMatrix(); 
  textAlign(LEFT, TOP);
  noStroke();

  const base = min(windowWidth, windowHeight);
  const txtSize = max(14, base * 0.02);
  textSize(txtSize);

  fill(255);

  if (!isUpsideDown) {
    text("Press T to switch Day / Night", 20, 20);
    text("Click the trunk to enter UpsideDown World", 20, 20 + txtSize + 8);
  } else {
    text("Click the trunk to return to normal world", 20, 20);
    text("Smoke button: toggle creepy fog", 20, 20 + txtSize + 8);
  }

  let rainX = width - RAIN_BTN_W - 20;
  let rainY = 20;
  fill(0, 0, 0, 140);
  rect(rainX, rainY, RAIN_BTN_W, RAIN_BTN_H, 8);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(txtSize);
  text("Rain ☔", rainX + RAIN_BTN_W / 2, rainY + RAIN_BTN_H / 2);

  if (isUpsideDown) {
    let smokeX = 20;
    let smokeY = 20 + (txtSize + 8) * 2;
    fill(0, 0, 0, 140);
    rect(smokeX, smokeY, SMOKE_BTN_W, SMOKE_BTN_H, 8);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Smoke ☁️", smokeX + SMOKE_BTN_W / 2, smokeY + SMOKE_BTN_H / 2);
  }

  pop();
}

// Mouse

function mousePressed() {

  let offsetX = (width / scaleFactor - DESIGN_W) / 2;
  let offsetY = (height / scaleFactor - DESIGN_H) / 2;

  let cx = mouseX / scaleFactor - offsetX;
  let cy = mouseY / scaleFactor - offsetY;

  if (cx > 250 && cx < 350 && cy > 350 && cy < 650) {
    isUpsideDown = !isUpsideDown;
    targetAngle = isUpsideDown ? PI : 0;
  }

   let rainX = width - RAIN_BTN_W - 20;
  let rainY = 20;
  if (mouseX > rainX && mouseX < rainX + RAIN_BTN_W &&
      mouseY > rainY && mouseY < rainY + RAIN_BTN_H) {
  
    if (!isUpsideDown) {
      isRaining = !isRaining;
      if (isRaining) {
        rainDrops = [];
        for (let i = 0; i < 200; i++) rainDrops.push(new RainDrop());
      }
    }
  }

  if (isUpsideDown) {
    const base = min(windowWidth, windowHeight);
    const txtSize = max(14, base * 0.02);
    let smokeX = 20;
    let smokeY = 20 + (txtSize + 8) * 2;

    if (mouseX > smokeX && mouseX < smokeX + SMOKE_BTN_W &&
        mouseY > smokeY && mouseY < smokeY + SMOKE_BTN_H) {

      isSmoke = !isSmoke;
      if (isSmoke) {
        smokeParticles = [];
        for (let i = 0; i < 60; i++) smokeParticles.push(new SmokeParticle());
      }
    }
  }
}

//Key control
function keyPressed(){
  if (key === 'T' || key === 't') {
    if (!isUpsideDown) {
      isNight = !isNight;
    } 
  }
}