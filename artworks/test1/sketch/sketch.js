// DATA WEB: WORLD (modelled) — p5.js, no outside data
//
// One node per continent, every pair joined by a bundle of strands. The
// traffic is an ESTIMATE produced by a small model, not a measurement:
//
//  1. Each continent has a daily rhythm. Activity rises in the evening and
//     sinks in the small hours of its own local time, computed from the real
//     clock (UTC), so the picture follows the actual time of day around the world.
//  2. Between continents, data flows mostly from where content lives (the
//     "hub" weights) toward where lots of people are online right now (the
//     "size" weights times current activity), scaled by how strongly each
//     pair is connected (AFFINITY).
//  3. Random surges (a viral video, a big download, a software update) hit
//     continents now and then, pulling a burst of traffic toward them.
//
// The weights below are rough hand-picked guesses. Change them freely.
//
// Keys:  t = real time / time-lapse (a day in two minutes)   h = toggle text   s = save PNG

// ---------- the model: edit these ----------
const TIMELAPSE_X = 720;            // time-lapse speed (720x = 24h in 2 minutes)
const PEAK_LOCAL_HOUR = 20.5;       // evening peak, local time
const SURGE_RATE = 0.004;           // chance per frame, per continent, of a surge

// tz: rough population-weighted offset from UTC in hours
// w:  relative number of people/devices online (biggest = 1)
// hub: relative share of the content and services hosted there
const CONTINENTS = [
  { code: 'NA', name: 'North America', hue: 205, hx: 0.17, hy: 0.30, tz: -6,  w: 0.75, hub: 1.00 },
  { code: 'SA', name: 'South America', hue: 130, hx: 0.27, hy: 0.73, tz: -4,  w: 0.25, hub: 0.15 },
  { code: 'EU', name: 'Europe',        hue: 275, hx: 0.50, hy: 0.24, tz: 2,   w: 0.65, hub: 0.80 },
  { code: 'AF', name: 'Africa',        hue: 35,  hx: 0.52, hy: 0.63, tz: 1.5, w: 0.15, hub: 0.10 },
  { code: 'AS', name: 'Asia',          hue: 340, hx: 0.77, hy: 0.30, tz: 6.5, w: 1.00, hub: 0.55 },
  { code: 'OC', name: 'Oceania',       hue: 175, hx: 0.85, hy: 0.76, tz: 10,  w: 0.08, hub: 0.15 }
];

// how strongly each pair of continents is connected (0..1)
const AFFINITY = {
  'NA-EU': 1.00, 'EU-AS': 0.90, 'NA-AS': 0.80, 'NA-SA': 0.70, 'EU-AF': 0.70,
  'AS-OC': 0.55, 'AS-AF': 0.40, 'NA-OC': 0.35, 'EU-SA': 0.30, 'NA-AF': 0.25,
  'EU-OC': 0.25, 'AS-SA': 0.20, 'AF-SA': 0.12, 'SA-OC': 0.08, 'AF-OC': 0.08
};

// ---------- look ----------
const STRANDS_PER_LINK = 9;
const SEGMENTS = 40;
const RING_AT = [10, 20, 30];
const CHUNKS = 4;
const MAX_PULSES = 900;

const N = CONTINENTS.length;

// ---------- state ----------
const nodes = [];
const links = [];
const LOFF = [];
const tmp = { x: 0, y: 0 };
const pulses = [];

let simMs = 0;
let timelapse = false;
let showHud = true;
let maxFlow = 0;

class Pulse {
  constructor(link, fromA) {
    this.link = link;
    this.fromA = fromA;
    this.origin = fromA ? link.a : link.b;
    this.strand = floor(random(STRANDS_PER_LINK));
    this.t = fromA ? 0 : 1;
    this.speed = random(0.004, 0.011);
    this.size = random(3, 6.5);
    this.hueOff = random(-1, 1);
  }
}

function affinity(i, j) {
  const a = CONTINENTS[i].code, b = CONTINENTS[j].code;
  return AFFINITY[a + '-' + b] ?? AFFINITY[b + '-' + a] ?? 0.1;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 100);
  background(230, 30, 5);
  simMs = Date.now();

  CONTINENTS.forEach((c, i) => {
    nodes.push({ ...c, idx: i, x: 0, y: 0, level: 0.2, demand: 0.2, surge: 0, flash: 0, links: [] });
  });
  for (let s = 0; s < STRANDS_PER_LINK; s++) {
    LOFF.push(map(s, 0, STRANDS_PER_LINK - 1, -1, 1) + random(-0.02, 0.02));
  }
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const L = {
        a: i, b: j, aff: affinity(i, j),
        fAB: 0.1, fBA: 0.1, act: 0.1, vivid: 0, bulge: 0, wob: 0,
        nx: 0, ny: 0, accA: 0, accB: 0, phase: random(TWO_PI),
        px: [], py: []
      };
      for (let s = 0; s < STRANDS_PER_LINK; s++) {
        L.px.push(new Float32Array(SEGMENTS + 1));
        L.py.push(new Float32Array(SEGMENTS + 1));
      }
      nodes[i].links.push(links.length);
      nodes[j].links.push(links.length);
      links.push(L);
    }
  }
  // strongest possible single-direction flow, used to scale everything to 0..1
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (i !== j) maxFlow = max(maxFlow, affinity(i, j) * nodes[i].hub * nodes[j].w);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(230, 30, 5);
}

function draw() {
  updateModel();
  updateNodes();
  updateLinks();

  // fading trails
  blendMode(BLEND);
  noStroke();
  fill(230, 30, 5, 45);
  rect(0, 0, width, height);

  drawLinks();
  drawNodes();
  drawPulses();
  if (showHud) drawHud();
}

// ======================= the traffic model =======================

// Data travelling from src to dst: content hub size x pair affinity x how many
// people are online at the destination right now.
function flowTarget(src, dst, aff) {
  const raw = aff * src.hub * dst.w * dst.demand;
  return constrain(pow(raw / maxFlow, 0.55), 0, 1);
}

function updateModel() {
  simMs += (timelapse ? TIMELAPSE_X : 1) * deltaTime;
  const utcHours = ((simMs / 3600000) % 24 + 24) % 24;

  for (const nd of nodes) {
    const local = (utcHours + nd.tz + 24) % 24;
    const daily = 0.18 + 0.82 * pow(0.5 + 0.5 * cos(TWO_PI * (local - PEAK_LOCAL_HOUR) / 24), 1.3);
    const wobble = (noise(frameCount * 0.01, nd.idx * 7) - 0.5) * 0.16;

    // random surge: a burst of demand that pulls traffic toward this continent
    if (random() < SURGE_RATE * (0.4 + daily)) {
      const amp = random(0.2, 0.55);
      nd.surge = min(0.8, nd.surge + amp);
      nd.flash = min(1, nd.flash + amp);
      spawnBurst(nd.idx, floor(amp * 50));
    }
    nd.surge *= 0.985;
    nd.flash *= 0.95;

    nd.demand = constrain(daily + wobble + nd.surge, 0, 1.3);
    nd.level = lerp(nd.level, constrain(nd.demand * (0.5 + 0.5 * sqrt(nd.w)), 0, 1), 0.1);
  }

  for (const L of links) {
    const a = nodes[L.a], b = nodes[L.b];
    L.fAB = lerp(L.fAB, flowTarget(a, b, L.aff), 0.08);
    L.fBA = lerp(L.fBA, flowTarget(b, a, L.aff), 0.08);
    L.act = (L.fAB + L.fBA) / 2;
    L.vivid = constrain(L.act * 0.9 + 0.5 * (a.flash + b.flash), 0, 1);
    L.accA += pow(L.fAB, 1.4) * 0.12;
    L.accB += pow(L.fBA, 1.4) * 0.12;
    while (L.accA >= 1) { addPulse(L, true);  L.accA -= 1; }
    while (L.accB >= 1) { addPulse(L, false); L.accB -= 1; }
  }
}

function addPulse(link, fromA) {
  if (pulses.length < MAX_PULSES) pulses.push(new Pulse(link, fromA));
}

// a surge at a continent draws a burst of shapes in from its neighbours
function spawnBurst(nodeIdx, n) {
  const nd = nodes[nodeIdx];
  for (let i = 0; i < n; i++) {
    const L = links[random(nd.links)];
    addPulse(L, L.a !== nodeIdx);
  }
}

// ======================= geometry =======================

function updateNodes() {
  const t = frameCount * 0.0025;
  for (const nd of nodes) {
    nd.x = width * nd.hx + (noise(t, nd.idx * 10) - 0.5) * width * 0.08;
    nd.y = height * nd.hy + (noise(t, nd.idx * 10 + 5) - 0.5) * height * 0.10;
  }
}

function linkPoint(L, s, t) {
  const A = nodes[L.a], B = nodes[L.b];
  const env = pow(max(0, sin(PI * t)), 1.15);
  const wob = 1 + L.wob * sin(frameCount * 0.025 + s * 0.7 + t * 5 + L.phase);
  const off = LOFF[s] * L.bulge * env * wob;
  tmp.x = lerp(A.x, B.x, t) + L.nx * off;
  tmp.y = lerp(A.y, B.y, t) + L.ny * off;
  return tmp;
}

function updateLinks() {
  for (const L of links) {
    const A = nodes[L.a], B = nodes[L.b];
    const dx = B.x - A.x, dy = B.y - A.y;
    const len = max(1, sqrt(dx * dx + dy * dy));
    L.nx = -dy / len;
    L.ny = dx / len;
    L.bulge = lerp(L.bulge, len * (0.025 + 0.26 * pow(L.act, 0.85)), 0.04);
    L.wob = 0.03 + 0.10 * L.act;
    for (let s = 0; s < STRANDS_PER_LINK; s++) {
      for (let j = 0; j <= SEGMENTS; j++) {
        const p = linkPoint(L, s, j / SEGMENTS);
        L.px[s][j] = p.x;
        L.py[s][j] = p.y;
      }
    }
  }
}

// ======================= drawing =======================

function hueLerp(h1, h2, t) {
  const d = ((h2 - h1 + 540) % 360) - 180;   // shortest way round the colour wheel
  return (h1 + d * t + 360) % 360;
}

function drawLinks() {
  noFill();
  const per = SEGMENTS / CHUNKS;
  for (const L of links) {
    const v = L.vivid;
    const hA = nodes[L.a].hue, hB = nodes[L.b].hue;
    strokeWeight(lerp(0.7, 1.5, v));
    for (let s = 0; s < STRANDS_PER_LINK; s++) {
      const u = LOFF[s];
      for (let c = 0; c < CHUNKS; c++) {
        const h = hueLerp(hA, hB, (c + 0.5) / CHUNKS) + u * 18 * v;
        stroke((h + 360) % 360, lerp(10, 80, v), lerp(50, 100, v), lerp(22, 62, v));
        beginShape();
        for (let j = c * per; j <= (c + 1) * per; j++) vertex(L.px[s][j], L.py[s][j]);
        endShape();
      }
    }
    // cross-threads
    strokeWeight(0.6);
    for (const j of RING_AT) {
      stroke(hueLerp(hA, hB, j / SEGMENTS), lerp(8, 40, v), lerp(45, 90, v), lerp(8, 22, v));
      beginShape();
      for (let s = 0; s < STRANDS_PER_LINK; s++) vertex(L.px[s][j], L.py[s][j]);
      endShape();
    }
  }
}

function drawNodes() {
  blendMode(ADD);
  noStroke();
  for (const nd of nodes) {
    const v = constrain(nd.level * 0.8 + nd.flash, 0, 1);
    const r = 8 + nd.level * 26 + nd.flash * 10;
    const sat = lerp(18, 90, v);
    fill(nd.hue, sat, 100, 10);
    ellipse(nd.x, nd.y, r * 3.4, r * 3.4);
    fill(nd.hue, sat, 100, 18);
    ellipse(nd.x, nd.y, r * 1.8, r * 1.8);
    fill(nd.hue, sat, 100, 75);
    ellipse(nd.x, nd.y, r * 0.55, r * 0.55);
  }
  blendMode(BLEND);
  if (showHud) {
    noStroke();
    textAlign(CENTER, TOP);
    textSize(12);
    for (const nd of nodes) {
      fill(nd.hue, 25, 100, 55);
      text(nd.code, nd.x, nd.y + 14 + nd.level * 14);
    }
  }
}

function drawPulses() {
  blendMode(ADD);
  noStroke();
  for (let k = pulses.length - 1; k >= 0; k--) {
    const p = pulses[k];
    const L = p.link;
    p.t += (p.fromA ? 1 : -1) * p.speed * (0.7 + 1.6 * L.act);
    if (p.t < 0 || p.t > 1) { pulses.splice(k, 1); continue; }

    const pos = linkPoint(L, p.strand, p.t);
    const v = L.vivid;
    const hue = (nodes[p.origin].hue + p.hueOff * 22 * v + 360) % 360;
    const sat = lerp(18, 90, v);
    const bri = lerp(60, 100, v);
    const sz = p.size * (0.8 + v);

    fill(hue, sat, bri, 14);
    ellipse(pos.x, pos.y, sz * 3.2, sz * 3.2);
    fill(hue, sat, bri, 85);
    ellipse(pos.x, pos.y, sz, sz);
  }
  blendMode(BLEND);
}

function drawHud() {
  noStroke();
  fill(0, 0, 100, 45);
  textSize(12);
  textAlign(LEFT, BOTTOM);
  const clock = new Date(simMs).toISOString().slice(11, 16) + ' UTC';
  const mode = timelapse ? 'time-lapse' : 'real time';
  text('estimated by a model, not measured  |  ' + mode + '  |  ' + clock +
       '      t: real time/time-lapse   h: hide text   s: save', 14, height - 12);
}

function keyPressed() {
  if (key === 't') {
    timelapse = !timelapse;
    if (!timelapse) simMs = Date.now();
  }
  if (key === 'h') showHud = !showHud;
  if (key === 's') saveCanvas('dataweb-model', 'png');
}
