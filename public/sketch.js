let startTime = 0;
let currentTime = 0;
let timeLeft;
let info = {
  name: '___',
  next: '___',
};
let timing = false;
let affirmations;
let affirmation;
let session;
let angle = 0;

function removeRandom(arr) {
  let i = floor(random(arr.length));
  return arr.splice(i, 1);
}

async function loadSession() {
  const response = await fetch('/session');
  session = await response.json();
  timeLeft = session.minutes * 60;
  affirmations = session.affirmations.slice();
  affirmation = removeRandom(affirmations);
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

  const fs = height / 10;
  textFont('Georgia');
  let timer = convertSeconds(timeLeft);
  if (timing)
    timer = convertSeconds(constrain(timeLeft - currentTime, 0, timeLeft));
  textSize(fs * 1.61803398875);
  text(`${timer}`, width / 2, height / 3 - fs * 1.61803398875);
  textSize(fs);
  text(`${info.name}`, width / 2, height / 3);
  textSize(fs / 1.61803398875);
  text(`up next: ${info.next}`, width / 2, height / 3 + fs);

  if (affirmations) {
    affFade = map(sin(angle - HALF_PI), -1, 1, 0, 255);
    fill(0, affFade);
    textSize(fs * 1.61803398875);
    text(affirmation, width / 2, 0.75 * height);
  }

  angle += 0.035;
  if (angle > TWO_PI) {
    angle = 0;
    affirmation = removeRandom(affirmations);
    if (affirmations.length < 1) {
      affirmations = session.affirmations.slice();
    }
  }
}

function convertSeconds(s) {
  var min = floor(s / 60);
  var sec = s % 60;

  let digits = timeLeft / 60 >= 10 ? 2 : 1;
  return nf(min, digits) + ':' + nf(sec, 2);
}
