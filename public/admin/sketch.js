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
  const response = await fetch('/session');
  session = await response.json();

  // extra spot for when we are done
  drawSession();
}


function drawSession() {
  removeElements(); // clear old session data
  for (let i = 0; i < session.presenters.length; i++) {
    const name = session.presenters[i];
    const T = session.minutes;

    presenterDiv = createDiv('');
    createSpan(`${i + 1}: `).parent(presenterDiv);
    inputs[i] = createInput(name).parent(presenterDiv).addClass(`${i}-name name`).input(() => {
      session.presenters[i] = inputs[i].elt.value;
    });
    TinMin[i] = createInput(str(T)).parent(presenterDiv).addClass(`${i}-timer timer`);
    const start = createButton('start')
      .parent(presenterDiv)
      .mousePressed(() => {
        socket.emit('new presenter', {
          name: inputs[i].value(),
          next: (inputs[i + 1] != null) ? inputs[i + 1].value() : 'All done!', // perhaps change this to a more desirable behavior
          minutes: TinMin[i].value(),
        });
      });
    const remove = createButton('remove')
      .parent(presenterDiv)
      .mousePressed(() => {
        session.presenters.splice(i, 1);
        drawSession();
      });
  }
  createElement('br').parent(presenterDiv);
  const add = createButton('New Row')
    .parent(presenterDiv)
    .mousePressed(() => {
      session.presenters.push('');
      drawSession();
    });
  // TODO: Save minutes? (need to modify core JSON structure)
  const save = createButton('Save JSON')
    .parent(presenterDiv)
    .mousePressed(() => {
      socket.emit('storeSession', session);
    });

}

