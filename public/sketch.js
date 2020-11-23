let startTime = 0;
let currentTime = 0;
let timeLeft;
let info = {
  name: 'starting soon',
  next: 'starting soon',
};
let timing = false;
let affirmations;
let affirmationIndex = 0;
let angle = 0;

async function loadSession() {
  const response = await fetch('/session');
  const session = await response.json();
  timeLeft = session.minutes * 60;
  affirmations = session.affirmations;
  affFade = 0;
}

function setup() {
  loadSession();
  createCanvas(windowWidth, windowHeight);
  clear();
  startTime = millis();
  const socket = io();
  socket.on('start presenter', (data) => {
    console.log(data);
    timing = true;
    info = data;
    startTime = millis();
  });
}

function draw() {
  clear();
  currentTime = floor((millis() - startTime) / 1000);
  textAlign(CENTER, CENTER);
  fill(0);
  textSize(24);
  let timer = convertSeconds(timeLeft);
  if (timing) timer = convertSeconds(timeLeft - currentTime);
  const txt = `${info.name}\n${timer}\nnext: ${info.next}`;
  text(txt, width / 2, height / 3);

  if (affirmations) {
    affFade = map(sin(angle - HALF_PI), -1, 1, 0, 255);
    fill(0, affFade);
    text(affirmations[affirmationIndex], width / 2, 0.75 * height);
  }

  angle += 0.01;
  if (angle > TWO_PI) {
    angle = 0;
    affirmationIndex = (affirmationIndex + 1) % affirmations.length;
  }
}

function convertSeconds(s) {
  var min = floor(s / 60);
  var sec = s % 60;
  return nf(min, 2) + ':' + nf(sec, 2);
}
