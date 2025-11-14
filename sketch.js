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

function setup() {
  createCanvas(windowWidth, windowHeight); 
  frameRate(60);  
  scaleFactor = min(windowWidth/ DESIGN_W, windowHeight/ DESIGN_H);

  for (let i = 0; i < 1000; i++){
    noisePoints.push({
      x: random(-width- 1000, width+ 1000),
      y: random(0, 650),
      c:[random(100,180), random(150,200), random(200,255), random(80,150)]
    });
  }
  generateTree(300, 650, 200, PI / 2, 1);
}


function draw(){
  //base background
  background(60,80,120);
  
  push();
  scale(scaleFactor);
  translate((width / scaleFactor - DESIGN_W)/ 2, (height/ scaleFactor - DESIGN_H)/2);

  noStroke();
  for (let p of noisePoints){
    fill(p.c[0],p.c[1],p.c[2],p.c[3]);
    rect(p.x, p.y, 100, 2);
  }

  fill(40,140,90);
  rect(0,650,600,100);
  stroke(0);
  strokeWeight(5);
  noFill();
  rect(0,650,600,100);
  noStroke();

  //yellow base
  fill(240,210,60);
  stroke(0);
  strokeWeight(10);
  rect(125,625,350,75);
  noStroke();

  //colorfull rects
  const colors = [
    color(240,210,60),
    color(240,70,70),
    color(40,160,100),
    color(240,210,60),
    color(40,160,100),
    color(240,210,60)
  ];
  const startX = 125;
  const startY = 625;
  const boxW = 350 / 6;
  const boxH = 75;

  for (let i = 0; i < 6; i++){
    fill(colors[i]);
    rect(startX + i * boxW, startY, boxW, boxH);
  }
  
  const bottomColors = [
    color(40,160,100),
    color(240,210,60),
    color(240,70,70),
    color(240,70,70),
    color(240,210,60),
    color(40,160,100)
  ];

  for (let i = 0; i < 6; i++){
    let cx = startX + i * boxW + boxW / 2;
    let cy = startY + boxH;
    let r = boxW * 0.9;
    fill(bottomColors[i]);
    arc(cx, cy, r, r, PI, 0);
  }

  const topColors = [
    color(40, 160, 100),
    color(240, 70, 70),
    color(40, 160, 100),
    color(240, 70, 70)
  ];
  const topCenters = [
    startX + boxW * 1.5,
    startX + boxW * 2.5,
    startX + boxW * 3.5,
    startX + boxW * 4.5
  ];
  for (let i = 0; i < 4; i++){
    let cx = topCenters[i];
    let cy = startY;
    let r = (i === 1 || i === 2) ? boxW * 0.7 : boxW * 0.9;
    fill(topColors[i]);
    arc(cx,cy,r,r,0,PI);
  }

  noStroke();
  for (let i = 0; i < 300; i++){
    fill(255,255,255,random(10,40));
    rect(random(125,475),random(625,700), 1, 1);
  }

  for (let branch of branches ){
    branch.draw(); 
  }

  for (let a of apples){
    a.update();
    a.draw();
  }
  
  noStroke();
  fill(255);
  textSize(25);
  if(gravityDirection === 1){
    text("Press SPACE to change gravity (now ↓ ↓ ↓)",20,785);
  }else{
    text("Press SPACE to change gravity (now ↑ ↑ ↑)",20,785);
  }
    text("- Let Newton be confused ! ! ! -",240,30);
    pop();
}



function fitWidow(){
  resizeCanvas(windowWidth,windowHeight);
  scaleFactor = min(windowWidth / DESIGN_W, windowHeight/ DESIGN_H);
}

function keyPressed(){
  if (key === ' '){
    gravityDirection *= -1;
    for (let a of apples){
      a.reset();
    } 
  }
}