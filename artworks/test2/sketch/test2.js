// Bouncing Ball: grab it, drag it around, and throw it!

// --- Settings you can play with ---
const GRAVITY = 0.6;         // how strongly the ball is pulled down
const BOUNCE = 0.8;          // 1 = perfectly bouncy, 0 = no bounce
const AIR_DRAG = 0.995;      // slows the ball slightly in the air
const FLOOR_FRICTION = 0.98; // slows sideways rolling on the floor
const MAX_SPEED = 45;        // limit on how hard you can throw
const BALL_RADIUS = 40;

let ball;
let throwVel;   // how fast the mouse was moving just before release
let hintAlpha = 255;

function setup() {
  createCanvas(800, 600);
  throwVel = createVector(0, 0);
  ball = {
    pos: createVector(width / 2, 120),
    vel: createVector(5, 0),
    r: BALL_RADIUS,
    grabbed: false,
    offset: createVector(0, 0) // where on the ball you grabbed it
  };
}

function draw() {
  drawBackground();
  updateBall();
  drawBall();
  drawHint();
  updateCursor();
}

// ---------- Physics ----------

function updateBall() {
  if (ball.grabbed) {
    // Ball follows the mouse, staying inside the canvas
    const target = createVector(mouseX, mouseY).add(ball.offset);
    target.x = constrain(target.x, ball.r, width - ball.r);
    target.y = constrain(target.y, ball.r, height - ball.r);

    // Measure how far the ball moved this frame (= its speed),
    // smoothed so the throw feels natural
    const moved = p5.Vector.sub(target, ball.pos);
    throwVel.lerp(moved, 0.5);

    ball.pos.set(target);
    ball.vel.set(0, 0);
    return;
  }

  // Gravity and air drag
  ball.vel.y += GRAVITY;
  ball.vel.mult(AIR_DRAG);
  ball.pos.add(ball.vel);

  // Floor
  if (ball.pos.y > height - ball.r) {
    ball.pos.y = height - ball.r;
    ball.vel.y *= -BOUNCE;
    ball.vel.x *= FLOOR_FRICTION;
    if (abs(ball.vel.y) < 1) ball.vel.y = 0; // settle instead of jittering
  }
  // Ceiling
  if (ball.pos.y < ball.r) {
    ball.pos.y = ball.r;
    ball.vel.y *= -BOUNCE;
  }
  // Right wall
  if (ball.pos.x > width - ball.r) {
    ball.pos.x = width - ball.r;
    ball.vel.x *= -BOUNCE;
  }
  // Left wall
  if (ball.pos.x < ball.r) {
    ball.pos.x = ball.r;
    ball.vel.x *= -BOUNCE;
  }
}

// ---------- Drawing ----------

function drawBackground() {
  // Soft navy-to-blue gradient
  for (let y = 0; y < height; y++) {
    const c = lerpColor(color(11, 37, 69), color(29, 78, 216), y / height);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawBall() {
  noStroke();

  // Shadow on the floor, smaller and fainter when the ball is high up
  const height01 = constrain((height - ball.pos.y) / height, 0, 1);
  fill(0, 0, 0, 70 * (1 - height01 * 0.7));
  ellipse(ball.pos.x, height - 6, ball.r * 2 * (1 - height01 * 0.5), 12);

  // Ball
  fill(ball.grabbed ? color(125, 211, 252) : color(56, 189, 248));
  stroke(255, 255, 255, 200);
  strokeWeight(3);
  circle(ball.pos.x, ball.pos.y, ball.r * 2);

  // Shine
  noStroke();
  fill(255, 255, 255, 140);
  circle(ball.pos.x - ball.r * 0.35, ball.pos.y - ball.r * 0.35, ball.r * 0.5);
}

function drawHint() {
  // Instruction text that fades away after the first grab
  if (ball.grabbed) hintAlpha = max(0, hintAlpha - 8);
  if (hintAlpha > 0) {
    noStroke();
    fill(255, hintAlpha);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Grab the ball and throw it!", width / 2, 40);
  }
}

function updateCursor() {
  const over = dist(mouseX, mouseY, ball.pos.x, ball.pos.y) <= ball.r;
  if (ball.grabbed) cursor("grabbing");
  else if (over) cursor("grab");
  else cursor(ARROW);
}

// ---------- Mouse / touch ----------

function mousePressed() {
  if (dist(mouseX, mouseY, ball.pos.x, ball.pos.y) <= ball.r) {
    ball.grabbed = true;
    ball.offset = p5.Vector.sub(ball.pos, createVector(mouseX, mouseY));
    throwVel.set(0, 0);
  }
}

function mouseReleased() {
  if (ball.grabbed) {
    ball.grabbed = false;
    ball.vel = throwVel.copy().limit(MAX_SPEED); // throw!
  }
}
