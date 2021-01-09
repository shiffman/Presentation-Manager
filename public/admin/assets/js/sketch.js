function setup() {
  noCanvas();
  loadSession();
}

// the dreaded GLOBAL VARS (bum, bum, BUMMMMM)
let inputs = [];
let TinMin = [];
let session;
let presenterDiv;
const socket = io();

async function loadSession() {
  const response = await fetch("/session");
  session = await response.json();
  // extra spot for when we are done
  drawSession();
}

socket.on("admin", (data) => {
  session = data;
  console.log(data);
  drawSession();
});

function drawSession() {
  removeElements(); // clear old session data
  const inputs = [];
  const TinMin = [];
  const TinSec = [];

  // extra spot for when we are done
  // session.presenters.push({ name: "💖", minutes: 1 });

  for (let i = 0; i < session.presenters.length; i++) {
    const name = session.presenters[i].name;
    const T = session.presenters[i].minutes;
    const S = session.presenters[i].seconds;

    const presenterDiv = createDiv("");
    createSpan(`${i + 1}: `).parent(presenterDiv);
    inputs[i] = createInput(name)
      .parent(presenterDiv)
      .addClass(`${i}-name name`);
    TinMin[i] = createInput(str(T))
      .parent(presenterDiv)
      .addClass(`${i}-timer timer`);
    TinSec[i] = createInput(str(S))
      .parent(presenterDiv)
      .addClass(`${i}-timer timer`);
    const start = createButton("start")
      .parent(presenterDiv)
      .mousePressed(() => {
        socket.emit("new presenter", {
          name: inputs[i].value(),
          next: inputs[i + 1] != null ? inputs[i + 1].value() : "All done!", // perhaps change this to a more desirable behavior
          minutes: TinMin[i].value(),
          seconds: TinSec[i].value(),
        });
      });

    const pop = createButton("delete")
      .parent(presenterDiv)
      .mousePressed(() => {
        session.presenters.splice(i, 1);
        socket.emit("storeSession", session);
        drawSession();
      });
  }

  const presenterDiv = createDiv("");
  const push = createButton("push")
    .parent(presenterDiv)
    .mousePressed(() => {
      session.presenters.push({ name: "", minutes: 1, seconds: 0 });
      socket.emit("storeSession", session);
      drawSession();
    });

  const presenterDiv2 = createDiv("");
  const stop = createButton("stop")
    .parent(presenterDiv2)
    .mousePressed(() => {
      socket.emit("stop presenter", {});
    });

  // curently broken
  // createElement('br').parent(presenterDiv);
  // const add = createButton('New presenter')
  //   .parent(presenterDiv)
  //   .mousePressed(() => {
  //     session.presenters.push('');
  //     drawSession();
  //   });

  const save = createButton("Save JSON")
    .parent(presenterDiv)
    .mousePressed(() => {
      for (let i in session.presenters) {
        session.presenters[i].name = inputs[i].value();
        session.presenters[i].minutes = TinMin[i].value();
        session.presenters[i].seconds = TinSec[i].value();
        // console.log(inputs[i]);
      }
      socket.emit("storeSession", session);
    });
}
