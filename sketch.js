const DESIGN_W = 600;
const DESIGN_H = 800;

let branches = [];
let apples = [];
let fireflies = [];
let noisePoints = [];

let isNight = false;
let isUpsideDown = false;

let gravity = 0.2;
let gravityDirection = 1;

let ground = 750;
let topY = 20;

let scaleFactor;

let buttons = [];
let corruptApples = false;


class Segment {
  constructor(x, y, length, angle, level) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.angle = angle;
    this.level = level;

    this.thickness = [0, 15, 10, 7, 4][level] || 4;

    this.swayAmp = random(1, 3);
    this.swaySpeed = random(0.2, 0.2);

    this.x2 = this.x + cos(angle) * length;
    this.y2 = this.y - sin(angle) * length;
  }

  draw() {
    stroke(isUpsideDown ? 60 : 0);
    strokeWeight(this.thickness);

    let sway = sin(frameCount * this.swaySpeed + this.y * 0.05) * this.swayAmp;
    let nx = this.x + cos(this.angle + radians(sway * 0.5)) * this.length;
    let ny = this.y - sin(this.angle + radians(sway * 0.5)) * this.length;

    line(this.x, this.y, nx, ny);
  }
}


class Apple {
  constructor(x, y, color) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.color = color;

    this.dropSpeed = 0;
    this.state = "waiting";
    this.timer = 0;

    this.swaySpeed = random(0.3, 0.5);
    this.swayRate = random(1, 3);
    this.swayPhase = random(0, TWO_PI);

    this.isCorrupting = false;
    this.scale = 1;
    this.alpha = 255;
    this.particles = [];
  }

  startCorrupt() {
    this.isCorrupting = true;
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
    this.dropSpeed = 0;
    this.state = "waiting";
    this.timer = 0;
  }

  update() {

if (this.isCorrupting) {
      this.scale -= 0.02;
      this.alpha -= 6;

      if (this.scale < 0) this.scale = 0;
      if (this.alpha < 0) this.alpha = 0;

      if (frameCount % 3 === 0) {
        this.particles.push({
          x: this.x + random(-5,5),
          y: this.y + random(-5,5),
          dx: random(-1, 1),
          dy: random(-1, -3),
          a: 255
        });
      }
      
      for (let p of this.particles) {
        p.x += p.dx;
        p.y += p.dy;
        p.a -= 10;
      }
      return;
    }

    if (this.state === "waiting") {
      this.timer++;
      if (this.timer > 120) {
        this.state = "falling";
        this.timer = 0;
      }
    }

    else if (this.state === "falling") {
      this.dropSpeed += gravity * gravityDirection;
      this.y += this.dropSpeed;

      if (gravityDirection === 1 && this.y >= ground) {
        this.y = ground;
        this.state = "landed";
      } else if (gravityDirection === -1 && this.y <= topY) {
        this.y = topY;
        this.state = "landed";
      }
    }

    else {
      this.timer++;
      if (this.timer > 120) this.reset();
    }
  }

  draw() {

push();
    translate(this.x, this.y);
    scale(this.scale);

    if (!isUpsideDown)
      fill(this.color[0], this.color[1], this.color[2], this.alpha);
    else
      fill(150, 0, 90, this.alpha);

   if (isNight && !isUpsideDown) {
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = color(255, 200, 150);
    }

    noStroke();
    ellipse(0, 0, 40, 40);
    drawingContext.shadowBlur = 0;

    pop();
   
   for (let p of this.particles) {
      fill(200, 0, 150, p.a);
      noStroke();
      ellipse(p.x, p.y, 6, 6);
    }
  }
}


class Firefly {
  constructor() {
    this.x = random(50, DESIGN_W - 50);
    this.y = random(100, 600);
    this.twinkle = random(0.02, 0.05);
  }

  update() {
    this.alpha = 150 + 100 * sin(frameCount * this.twinkle);
    this.y += sin(frameCount * this.twinkle) * 0.3;
  }

  draw() {
    noStroke();
    fill(255,220,120,this.alpha);
    ellipse(this.x, this.y, 6, 6);
  }
}


class UIButton {
  constructor(x, y, w, h, label, callback) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.label = label;
    this.callback = callback;
  }

  draw() {
    fill(60,0,80,160);
    stroke(255);
    rect(this.x, this.y, this.w, this.h, 8);

    fill(255);
    noStroke();
    textSize(18);
    textAlign(CENTER, CENTER);
    text(this.label, this.x + this.w/2, this.y + this.h/2);
  }

  isHovered(mx, my) {
    return mx > this.x && mx < this.x + this.w &&
           my > this.y && my < this.y + this.h;
  }
}


function generateTree(x, y, length, angle, level) {
  if (length < 40) return;

  let s = new Segment(x, y, length, angle, level);
  branches.push(s);

  let offset = random(radians(30), radians(80));
  let endX = s.x2;
  let endY = s.y2;

  if (level >= 3 && random() < 0.2) {
    let t = random(0.3, 0.9);

    apples.push(new Apple(
      lerp(s.x, s.x2, t),
      lerp(s.y, s.y2, t),
      random([
        [240,70,70],[240,140,60],[230,90,140],[250,120,90]])
    ));
  }

  generateTree(endX, endY, length * 0.75, angle + offset, level + 1);
  generateTree(endX, endY, length * 0.75, angle - offset, level + 1);
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  scaleFactor = min(windowWidth / DESIGN_W, windowHeight / DESIGN_H);

  for (let i = 0; i < 1000; i++) {
    noisePoints.push({
      x: random(-800, DESIGN_W + 800),
      y: random(0, 650),
      c: [random(120,180), random(150,210), random(200,255), random(60,150)]
    });
  }

  generateTree(300, 650, 200, PI/2, 1);

  for (let i = 0; i < 40; i++) fireflies.push(new Firefly());

buttons.push(new UIButton(
    430, 40, 150, 50,
    "Corrupt 🍎",
    ()=>{ 
      startCorruption = true;
      for (let a of apples) a.startCorrupt();
    }
  ));
}


function draw() {
  background(
    isUpsideDown ? color(20,10,30) :
    isNight ? color(20,30,60) :
    color(100,150,200)
  );

  push();
  scale(scaleFactor);

  translate(
    (width/scaleFactor - DESIGN_W)/2,
    (height/scaleFactor - DESIGN_H)/2
  );

  if (isUpsideDown) {
    scale(1, -1);          
    translate(0, -DESIGN_H);  
  }

  noStroke();
  for (let p of noisePoints) {
    fill(p.c);
    rect(p.x, p.y, 100, 2);
  }


  fill(isUpsideDown ? 40 : 40,140,90);
  rect(0,650,600,100);

  stroke(0);
  strokeWeight(5);
  noFill();
  rect(0,650,600,100);
  noStroke();

  
  fill(isUpsideDown ? color(150,100,40) : color(240,210,60));
  stroke(0);
  strokeWeight(10);
  rect(125,625,350,75);
  noStroke();

  
  branches.forEach(b => b.draw());
  apples.forEach(a => { a.update(); a.draw(); });

  if (!isUpsideDown && isNight) {
fireflies.forEach(f => { f.update(); f.draw(); });

    fill(255,255,200,80);
    ellipse(520,100,80,80);
  }
   
if (isUpsideDown) {
    push();
    scale(1, -1);
    translate(0, -DESIGN_H);
    buttons.forEach(b => b.draw());
    pop();
}

 pop();
 
 push();
  scale(scaleFactor);
  translate((width/scaleFactor - DESIGN_W)/2, (height/scaleFactor - DESIGN_H)/2);
  fill(255);
  textSize(20);
  text("Press T for Day / Night", 20, 40);
  pop();
}


function mousePressed() {
  let cx = mouseX / scaleFactor - (width/scaleFactor - DESIGN_W)/2;
  let cy = mouseY / scaleFactor - (height/scaleFactor - DESIGN_H)/2;

  if (!isUpsideDown && cx > 250 && cx < 350 && cy > 400 && cy < 650) {
    isUpsideDown = true;
  }

  if (isUpsideDown) {
    let mx = cx;
    let my = DESIGN_H - cy;

    for (let b of buttons) {
      if (b.isHovered(mx, my)) {
        b.callback();
        return;
      }
    }
  }
}


function keyPressed() {
  if (key === " ") { 
    gravityDirection *= -1;
    apples.forEach(a => a.reset());
  }

  if (key === "T" || key === "t") { 
    isNight = !isNight;
  }
}
