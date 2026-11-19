// --- Settings you can play with ---
let GRAVITY = 0.6; // how strongly the ball is pulled down
let BOUNCE = 0.8; // 1 = perfectly bouncy, 0 = no bounce
let AIR_DRAG = 0.995; // slows the ball slightly in the air
let FLOOR_FRICTION = 0.98; // slows sideways rolling on the floor
let MAX_SPEED = 45; // limit on how hard you can throw
let BALL_RADIUS = 40;
let pos; // ball position
let vel; // ball velocity
let grabOffset; // where on the ball you grabbed it
let throwVel; // how fast the mouse was moving just before release
let grabbed = false;
let hintAlpha = 255;
let bg; // pre-drawn background gradient
function setup() {
    createCanvas(800, 600);
    pos = new p5.Vector(width / 2, 120);
    vel = new p5.Vector(5, 0);
    grabOffset = new p5.Vector(0, 0);
    throwVel = new p5.Vector(0, 0); // Draw the navy-to-blue gradient once, then reuse it every frame
    bg = createGraphics(width, height);
    bg.beginDraw();
    for (let y = 0; y < height; y++) {
        let c = lerpColor(color(11, 37, 69), color(29, 78, 216), y / height);
        bg.stroke(c);
        bg.line(0, y, width, y);
    }
    bg.endDraw();
}
function draw() {
    image(bg, 0, 0);
    updateBall();
    drawBall();
    drawHint();
    updateCursor();
} // ---------- Physics ----------
function updateBall() {
    if (grabbed) {
        // Ball follows the mouse, staying inside the window
        let target = new p5.Vector(mouseX, mouseY).add(grabOffset);
        target.x = constrain(target.x, BALL_RADIUS, width - BALL_RADIUS);
        target.y = constrain(target.y, BALL_RADIUS, height - BALL_RADIUS); // Measure how far the ball moved this frame (= its speed),
        // smoothed so the throw feels natural
        let moved = PVector.sub(target, pos);
        throwVel.lerp(moved, 0.5);
        pos.set(target);
        vel.set(0, 0);
        return;
    } // Gravity and air drag
    vel.y += GRAVITY;
    vel.mult(AIR_DRAG);
    pos.add(vel); // Floor
    if (pos.y > height - BALL_RADIUS) {
        pos.y = height - BALL_RADIUS;
        vel.y *= -BOUNCE;
        vel.x *= FLOOR_FRICTION;
        if (abs(vel.y) < 1) vel.y = 0; // settle instead of jittering
    } // Ceiling
    if (pos.y < BALL_RADIUS) {
        pos.y = BALL_RADIUS;
        vel.y *= -BOUNCE;
    } // Right wall
    if (pos.x > width - BALL_RADIUS) {
        pos.x = width - BALL_RADIUS;
        vel.x *= -BOUNCE;
    } // Left wall
    if (pos.x < BALL_RADIUS) {
        pos.x = BALL_RADIUS;
        vel.x *= -BOUNCE;
    }
} // ---------- Drawing ----------
function drawBall() {
    noStroke(); // Shadow on the floor, smaller and fainter when the ball is high up
    let heightFrac = constrain((height - pos.y) / height, 0, 1);
    fill(0, 0, 0, 70 * (1 - heightFrac * 0.7));
    ellipse(pos.x, height - 6, BALL_RADIUS * 2 * (1 - heightFrac * 0.5), 12); // Ball
    fill(grabbed ? color(125, 211, 252) : color(56, 189, 248));
    stroke(255, 255, 255, 200);
    strokeWeight(3);
    ellipse(pos.x, pos.y, BALL_RADIUS * 2, BALL_RADIUS * 2); // Shine
    noStroke();
    fill(255, 255, 255, 140);
    ellipse(
        pos.x - BALL_RADIUS * 0.35,
        pos.y - BALL_RADIUS * 0.35,
        BALL_RADIUS * 0.5,
        BALL_RADIUS * 0.5
    );
}
function drawHint() {
    // Instruction text that fades away after the first grab
    if (grabbed) hintAlpha = max(0, hintAlpha - 8);
    if (hintAlpha > 0) {
        noStroke();
        fill(255, hintAlpha);
        textAlign(CENTER, CENTER);
        textSize(24);
        text("Grab the ball and throw it!", width / 2, 40);
    }
}
function updateCursor() {
    let over = dist(mouseX, mouseY, pos.x, pos.y) <= BALL_RADIUS;
    if (grabbed) cursor(MOVE);
    else if (over) cursor(HAND);
    else cursor(ARROW);
} // ---------- Mouse / keyboard ----------
function mousePressed() {
    if (dist(mouseX, mouseY, pos.x, pos.y) <= BALL_RADIUS) {
        grabbed = true;
        grabOffset = PVector.sub(pos, new p5.Vector(mouseX, mouseY));
        throwVel.set(0, 0);
    }
}
function mouseReleased() {
    if (grabbed) {
        grabbed = false;
        vel = throwVel.copy(); // throw!
        vel.limit(MAX_SPEED);
    }
}
function keyPressed() {
    if (key == "s" || key == "S") {
        saveFrame("thumb.png");
    }
}
