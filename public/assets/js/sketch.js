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
let gravity;
let noteAudio;
let playAudio = false;

// fireworks
let colors;
const fireworks = [];

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
  gravity = createVector(0, 0.2);
  colors = [
    color(146, 83, 161),
    color(240, 99, 164),
    color(45, 197, 244),
    color(252, 238, 33),
    color(241, 97, 100),
    color(112, 50, 126),
    color(164, 41, 99),
    color(11, 106, 136),
    color(248, 158, 79),
    color(146, 83, 161),
    color(236, 1, 90),
  ];
  createCanvas(windowWidth, windowHeight);
  clear();
  startTime = millis();
  const socket = io();
  socket.on('start presenter', (data) => {
    console.log(data);
    timing = true;
    info = data;
    startTime = millis();

    // if sound exist & noteis playing = stop 
    if (noteAudio && noteAudio.isPlaying()) {
      noteAudio.stop();
    }

    playAudio = true;
  });
  socket.on('update note', (data) => {
    console.log('load note from blob : ', data);
    noteAudio = loadSound(data);
  });
}

function draw() {
  clear();
  currentTime = floor((millis() - startTime) / 1000);
  textAlign(CENTER, CENTER);
  fill(0);
  noStroke();

  const fs = height / 10;
  textFont('Georgia');
  let timer = convertSeconds(timeLeft);
  let left = timeLeft - currentTime;
  if (left < 0) {
    left = 0;
    if (random(1) < 0.05) {
      fireworks.push(new Firework());
    }

    if (playAudio && noteAudio) {
      console.log('playing audio ...');
      playAudio = false;

      // stop if old still playing
      if (noteAudio.isPlaying()) {
        noteAudio.stop();
      }

      // play new 
      noteAudio.play();
    }

  }
  if (timing) {
    timer = convertSeconds(left);
  }

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

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();

    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
}

function convertSeconds(s) {
  var min = floor(s / 60);
  var sec = s % 60;

  let digits = timeLeft / 60 >= 10 ? 2 : 1;
  return nf(min, digits) + ':' + nf(sec, 2);
}
