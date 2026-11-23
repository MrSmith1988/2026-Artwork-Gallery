// worldmap.js - coarse, hand-drawn continent outlines as [longitude, latitude]
// points. The sketch fills these with a grid of dots, so the shapes only need
// to be roughly right. 'c' is the continent each outline belongs to. When
// outlines overlap, the first one listed wins.

const LAND = [
  // ---------------- North America ----------------
  { c: 'NA', p: [
    [-168,65.5],[-166,68.5],[-157,71],[-141,69.7],[-128,70],[-116,68.5],[-108,68],[-98,68],
    [-91,68.5],[-86,66.5],[-87,64.5],[-94,61],[-94,58.5],[-90,57],[-85,55.5],[-82,53],
    [-80,51.5],[-79,53],[-77,56],[-78,59],[-77,62],[-72,61.5],[-70,60],[-65,60.5],
    [-62,58],[-61,55.5],[-57,52.5],[-56,51.5],[-60,50],[-66,49.5],[-64.5,48.2],[-65,46.8],
    [-61.5,45.8],[-60,46],[-63,44.5],[-66,43.8],[-67,45],[-70,43.8],[-70.5,42],[-74,40.5],
    [-76,38],[-75.5,35.5],[-78,34],[-81,31.5],[-80,27],[-80.5,25.2],[-82,26.5],[-83,29.5],
    [-85,29.8],[-89,30],[-90,29],[-94,29.5],[-97,27.5],[-97.5,24],[-97.8,21],[-96,19],
    [-94.5,18.2],[-91,18.8],[-90.5,21],[-87,21.5],[-87.5,18],[-88,16],[-84,15.8],[-83.3,14.5],
    [-83.5,11],[-81,8.8],[-79,9.5],[-77.5,8.5],[-78.5,7.5],[-80.5,7.3],[-83,8.2],[-85.7,10],
    [-87.5,13],[-91,14],[-94,16],[-97,15.8],[-101,17.5],[-105.5,20],[-105.5,22.5],[-109,25.5],
    [-112.5,29.5],[-114.7,31.5],[-117,32.5],[-118.5,34],[-120.5,34.5],[-122.5,37.5],[-124,40.5],
    [-124.5,43],[-124,46.5],[-124.7,48.3],[-127,50.5],[-130,54],[-134,57.5],[-138,59],
    [-144,60],[-148,60.5],[-152,59],[-155,57.5],[-158,56],[-162,55],[-164,54.8],[-160,58],
    [-162,58.5],[-165,61],[-163,63.5],[-166,65]
  ]},
  { c: 'NA', p: [ // Baja California
    [-114.7,31],[-114,28.5],[-112.5,26],[-110.3,23],[-110,23.3],[-112.2,25.3],[-113.8,27.5],[-115.3,29.5]
  ]},
  { c: 'NA', p: [ // Greenland
    [-73,78],[-60,82],[-30,83],[-20,81],[-18,77],[-22,72],[-22,70],[-32,68],[-40,65],
    [-43,60],[-47,61],[-52,65],[-54,68],[-55,71],[-60,76],[-68,76.5]
  ]},
  { c: 'NA', p: [ // Baffin Island
    [-88,72],[-80,73.5],[-70,71],[-62,67],[-65,63],[-72,63.5],[-78,65],[-74,68.5],[-80,70],[-86,70]
  ]},
  { c: 'NA', p: [ // Victoria Island
    [-118,73],[-105,73],[-101,70],[-108,69],[-117,70]
  ]},
  { c: 'NA', p: [ // Devon / Ellesmere
    [-92,76],[-80,75],[-75,78],[-62,82],[-72,83],[-90,81]
  ]},
  { c: 'NA', p: [ // Cuba
    [-85,22],[-82,23],[-78,22.5],[-74,20.2],[-77.5,19.8],[-80,22]
  ]},
  { c: 'NA', p: [ // Hispaniola
    [-74.4,19.8],[-70,19.8],[-68.5,18.4],[-71.5,17.6],[-74.2,18.4]
  ]},

  // ---------------- South America ----------------
  { c: 'SA', p: [
    [-77.5,8.5],[-76,9.5],[-72,12],[-71,11],[-68,10.6],[-64,10.6],[-61,10.5],[-60,8.5],
    [-57,6],[-52,5],[-50,1.5],[-50,0],[-48,-1],[-44,-2.5],[-39,-3.5],[-35,-5.5],
    [-35,-8.5],[-37.5,-12.5],[-39,-17.5],[-40.5,-21],[-42.5,-23],[-45,-24],[-48.5,-26],
    [-48.7,-28.5],[-52,-32],[-54,-34.5],[-57,-35],[-57.5,-37.5],[-62,-39],[-65,-41],
    [-63.5,-42.5],[-65.5,-45],[-67.5,-46.5],[-66,-48],[-69,-51],[-68.5,-52.5],[-70,-54],
    [-68,-55],[-72,-54],[-74,-50],[-75.5,-46.5],[-73.5,-42],[-73.5,-37],[-71.5,-32],
    [-71.5,-28],[-70.5,-23],[-70.3,-18.5],[-76,-14],[-79,-8],[-81,-5],[-80,-2],[-80.5,-0.5],
    [-78.5,2],[-77.5,4]
  ]},

  // ---------------- Europe ----------------
  { c: 'EU', p: [ // mainland
    [-9,37],[-9.5,39],[-9,43],[-8,43.7],[-2,43.5],[-1.3,46],[-4.5,48.5],[-1.5,48.7],
    [0,49.6],[2,51],[4,52],[7,53.5],[8.5,55],[8,57],[10.5,57.7],[10.5,55],[11,54.2],
    [14,54],[19,54.5],[21,55.5],[21,57],[24,57.3],[24.5,59.4],[28,59.7],[30,60],
    [33,63],[34,66],[41,66],[44,68],[53,68.5],[60,69],[60,50],[48,46],[40,42],[36,41.5],
    [29,41.2],[26.2,40.8],[24,40.2],[24,37.8],[22.5,36.5],[21.5,37],[21,38.5],[20.5,39.5],
    [19.5,41],[19,42],[15.5,44.2],[13.5,45.5],[12.3,45.2],[12.5,44],[14,42.5],[16,41.9],
    [18.5,40.3],[16.6,38.9],[15.7,37.9],[16,39.5],[15,40.2],[14,40.8],[12.5,41.5],[11,42.5],
    [10.3,43.8],[8.5,44.4],[7,43.7],[4.5,43.4],[3,42.4],[3.2,41.8],[0.8,41],[-0.3,39.5],
    [-0.8,37.6],[-2,36.8],[-4.5,36.6],[-5.6,36],[-6.5,36.8]
  ]},
  { c: 'EU', p: [ // Scandinavia and Finland
    [5.5,58.8],[5,61],[8,63.5],[12,66],[15,68.7],[19,70],[25,71],[30,70.5],[31,69.5],
    [29,67.5],[29.5,65],[30,63],[28.5,61],[27,60.4],[23,59.9],[21.2,61],[21.5,63.5],
    [25,65.4],[22.5,65.8],[19.5,64],[17.5,62],[17.3,60.6],[19,59.7],[16.7,57.5],[16,56.2],
    [14,55.4],[12.8,55.7],[12.2,57.5],[11,58.8],[9,58.2],[7,58]
  ]},
  { c: 'EU', p: [ // Great Britain
    [-5.5,50],[-3,50.5],[1.5,51],[1.7,52.7],[0,53.5],[-2,55.5],[-2,57.5],[-4,57.7],
    [-3.5,58.6],[-5.5,58.6],[-6.2,56.5],[-5,55.5],[-3.2,54.8],[-3,53.5],[-4.8,52.5],[-4.2,51.6]
  ]},
  { c: 'EU', p: [ // Ireland
    [-10,51.7],[-6.2,52.2],[-6,54],[-5.5,55],[-8,55.2],[-10,54],[-10,53]
  ]},
  { c: 'EU', p: [ // Iceland
    [-24,65.5],[-22,66.3],[-16,66.5],[-13.5,65],[-15,63.8],[-19,63.4],[-22.5,63.8]
  ]},
  { c: 'EU', p: [ // Sicily
    [12.4,38],[15.6,38.2],[15.1,36.7],[12.5,37.6]
  ]},
  { c: 'EU', p: [ // Sardinia
    [8.2,41],[9.7,41],[9.6,39.2],[8.5,39]
  ]},

  // ---------------- Africa ----------------
  { c: 'AF', p: [
    [-17,21],[-13,27.5],[-10,29.5],[-9.5,31.5],[-6.5,34],[-5.8,35.8],[-2,35.2],[3,36.8],
    [10,37.2],[11,36],[10.2,34],[11,33.2],[15,32.3],[19,30.5],[20,32.5],[23,32.8],
    [25,31.8],[29,30.9],[32,31.3],[34,31.2],[32.5,29.8],[33,28],[34.5,25.5],[35.5,23.5],
    [37,21],[38.5,18],[40,15.5],[43,12.8],[43,11.7],[44,10.5],[47,11.2],[51,11.8],
    [49.5,8],[47.5,4.5],[45,2],[41,-1.5],[39,-4.5],[39.3,-7],[40,-10.5],[40.5,-15],
    [36,-18.5],[35,-24],[33,-25.8],[32.5,-28.5],[30,-31.2],[27.5,-33.3],[25.5,-34],
    [22,-34.2],[20,-34.8],[18.5,-34],[18,-32],[16.5,-28.5],[15,-26.5],[14.5,-22.5],
    [13.5,-20],[11.8,-17.2],[13.5,-12],[12.3,-6],[12,-5],[9.5,-1],[9.5,3],[8.5,4.5],
    [6,4.3],[4,6.3],[1.5,6.2],[-2,4.8],[-4.5,5.2],[-7.5,4.4],[-11,6.7],[-13.3,9],
    [-15,11.5],[-16.8,13.5],[-16.5,16]
  ]},
  { c: 'AF', p: [ // Madagascar
    [49.3,-12],[50.5,-15.5],[49.5,-18],[47.5,-24.5],[45,-25.5],[43.7,-23],[44.3,-19.5],[46,-15.5],[48,-13.5]
  ]},

  // ---------------- Asia ----------------
  { c: 'AS', p: [
    [60,69],[68,72],[73,72.5],[80,73],[87,75],[100,77],[105,77.5],[113,74],[125,73.5],
    [130,71],[140,72.5],[150,71.5],[160,69.5],[170,70],[180,68.5],[180,65.5],[177,64.5],
    [172,61],[166,60],[163,57.5],[161,54.5],[158,52],[156.7,50.8],[155.8,53],[156,57],
    [158.5,60.5],[154,59.5],[148,59.3],[143,59.3],[139,57.5],[137,54],[141,53],[140.5,49.5],
    [138,46.5],[135,43.5],[132,42.8],[130,42.5],[129.5,40.8],[127.5,39.5],[129.4,36.5],
    [129,35],[126.5,34.7],[126.3,36.7],[125.2,38.5],[124.5,39.8],[122,40.2],[121.5,39],
    [119.5,39.5],[118,39],[118.8,37.5],[120.5,37.8],[122.5,37.2],[120.7,36],[119.3,34.8],
    [121.5,32.5],[122,30.5],[121,28],[119,25.5],[116.5,23],[114,22.3],[111,21.5],
    [110,20.3],[109.3,21.5],[108,21.5],[106.5,20.2],[105.8,19],[108.5,15.5],[109.3,12.2],
    [107.5,10.5],[105,8.7],[104.8,10.3],[103,10.5],[102.3,12.2],[100.8,13.3],[99.9,11],
    [100.3,8.5],[101.5,6.5],[103.4,4.5],[104.2,1.4],[103.5,1.4],[101.3,2.8],[100.3,5.5],
    [98.4,8],[98.5,10],[98.7,13],[97.6,16.5],[94.8,16],[94.3,18.8],[92.5,20.5],[91.5,22.5],
    [89,21.8],[87,21.5],[86.5,20],[84.5,18.2],[82,16.5],[80.2,15.5],[80.3,13],[79.9,10.5],
    [78,8.8],[77.5,8.1],[76.3,9.8],[75,12.5],[74,15],[72.8,19],[72.7,21],[70.5,21],
    [69,22.2],[70.3,23],[68.5,23.7],[67,24.8],[66.5,25.4],[62.5,25.2],[61.5,25],[57.5,25.7],
    [56.4,27.1],[54.5,26.5],[52,27.8],[50.3,29.5],[48.5,30],[48,29.5],[50,26.5],[51.5,24.5],
    [54,24.2],[56,26],[56.5,24.5],[58.5,23.5],[59.8,22.5],[58.6,20.5],[57.8,19],[55,17],
    [52,16],[49,14.5],[45,12.8],[43.3,12.7],[42.8,15.5],[42.5,16.8],[41,19.5],[39,21.5],
    [38,24],[36,27.5],[35,28.5],[34.9,29.5],[34.5,31.5],[35.6,33.8],[36,36],[36,36.7],
    [33,36.2],[30.5,36.8],[28,36.7],[27,37.5],[26.5,39.3],[26.5,40.5],[29,41],[31,41.2],
    [35,42],[38,41],[41.5,41.2],[44,42.6],[48,46],[55,49],[60,52]
  ]},
  { c: 'AS', p: [ // Honshu
    [130.9,34],[132.5,35.5],[136,36],[137,37.3],[139.5,38.5],[140,40.5],[141.5,41.3],
    [142,39.5],[141,37.5],[140.8,35.7],[138.8,34.6],[136.8,34.5],[135,33.7],[133,34.2]
  ]},
  { c: 'AS', p: [ // Kyushu
    [129.7,33],[131.5,33.8],[131.3,31.5],[130.5,31]
  ]},
  { c: 'AS', p: [ // Hokkaido
    [140,42],[141.5,45.4],[145.4,43.4],[143,42],[141,41.8]
  ]},
  { c: 'AS', p: [ // Sakhalin
    [142,46],[143.2,49],[143.3,53.5],[142.2,54],[142,50]
  ]},
  { c: 'AS', p: [ // Taiwan
    [120.2,23],[121.5,25.2],[122,24.7],[120.8,21.9]
  ]},
  { c: 'AS', p: [ // Hainan
    [108.7,19.5],[111,20],[110.5,18.3],[109,18.3]
  ]},
  { c: 'AS', p: [ // Luzon
    [120,18.5],[122.2,18.4],[122,16],[121.5,14],[124,13],[121,13.7],[120.5,15]
  ]},
  { c: 'AS', p: [ // Mindanao
    [122,7],[125.5,9.5],[126.4,7],[125.5,5.8],[123,7]
  ]},
  { c: 'AS', p: [ // Sri Lanka
    [79.8,9.8],[81.8,7.5],[80.5,6],[79.8,7.5]
  ]},
  { c: 'AS', p: [ // Sumatra
    [95.3,5.6],[98,4],[100.5,2],[103.7,-1],[106,-3.2],[105.8,-5.8],[102.2,-4],[99,-1.5],[97,2],[95.5,3.6]
  ]},
  { c: 'AS', p: [ // Java
    [105.2,-6.8],[108.5,-6.5],[112,-6.9],[114.5,-7.7],[114.5,-8.7],[110,-8.2],[106.5,-7.5]
  ]},
  { c: 'AS', p: [ // Borneo
    [109,1.5],[111,2.5],[113.5,3.8],[115.5,5.5],[117,7],[119,5.2],[118,1],[117.5,0],
    [116.5,-2.5],[114.5,-4],[110.5,-3],[109,-0.5]
  ]},

  // ---------------- Oceania ----------------
  { c: 'OC', p: [ // Australia
    [113.2,-22],[114.2,-26],[115,-30],[115.8,-32.5],[115,-34.2],[118,-35],[123,-34],
    [126,-32.3],[131.5,-31.5],[134,-32.7],[137.8,-33],[138,-35.5],[140,-38],[143.5,-38.8],
    [146.4,-39],[148.2,-37.8],[150.3,-35.5],[151.3,-33.5],[153,-30],[153.5,-28],[153,-25.5],
    [151,-23.5],[149,-21],[146.5,-19],[145.5,-15],[143.5,-14],[142.5,-10.8],[141.5,-13.5],
    [141.5,-17],[139.5,-17.5],[135.5,-15],[136.7,-12.2],[132,-11.3],[130,-12.5],[129.5,-15],
    [126.5,-14],[123,-17],[122,-18],[121.5,-19.5],[117,-20.5],[114,-22]
  ]},
  { c: 'OC', p: [ // New Guinea
    [131,-1],[135,-3.2],[138,-1.8],[141,-2.7],[145,-4.5],[147.5,-6],[150.3,-10.5],
    [147,-10],[143.5,-8.5],[141,-9.1],[138,-8.2],[137.7,-5.5],[135.5,-4.5],[133,-4],[132,-2.8]
  ]},
  { c: 'OC', p: [ // Tasmania
    [144.7,-40.8],[148.3,-40.9],[148,-43.2],[146,-43.6]
  ]},
  { c: 'OC', p: [ // New Zealand, North Island
    [172.7,-34.5],[174.5,-36.5],[176,-37.5],[178.5,-37.7],[177,-39.5],[175.2,-41.5],
    [174.5,-39.5],[173.8,-39.2],[174.7,-37],[173.5,-35.5]
  ]},
  { c: 'OC', p: [ // New Zealand, South Island
    [172.7,-40.5],[174.3,-41.2],[173,-43.8],[171,-44.5],[169,-46.6],[166.5,-46],[168.5,-44],[171.5,-41.8]
  ]}
];

// seas that sit inside the outlines above and must stay empty
const WATER = [
  [[47,45],[50,46.5],[53,45],[53,41],[54,37],[51,36.7],[49,38],[49,40.5],[47.5,42.5]],       // Caspian Sea
  [[28,41.5],[28,44],[30,45.5],[33.5,46],[36,45.5],[38,47],[41.5,42],[41,41],[36,41.7],[32,41.5]] // Black Sea
];


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
  //text('estimated by a model, not measured  |  ' + mode + '  |  ' + clock +
    //   '      t: real time/time-lapse   h: hide text   s: save', 14, height - 12);
}

function keyPressed() {
  if (key === 't') {
    timelapse = !timelapse;
    if (!timelapse) simMs = Date.now();
  }
  if (key === 'h') showHud = !showHud;
  if (key === 's') saveCanvas('dataweb-model', 'png');
}
