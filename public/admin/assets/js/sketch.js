function setup() {
  noCanvas();
  loadSession();
}

async function loadSession() {
  const socket = io();
  const response = await fetch('/session');
  const session = await response.json();
  const inputs = [];
  // extra spot for when we are done

  session.presenters.push('💖');
  for (let i = 0; i < session.presenters.length; i++) {
    const name = session.presenters[i];
    const presenterDiv = createDiv('');
    createSpan(`${i + 1}: `).parent(presenterDiv);
    inputs[i] = createInput(name).parent(presenterDiv);
    const start = createButton('Start')
      .parent(presenterDiv)
      .mousePressed(() => {
        socket.emit('new presenter', {
          name: inputs[i].value(),
          next: inputs[i + 1].value(),
        });
      });
  }
  addAudioOption(socket);
}


function addAudioOption(socket) {
  var audioData = "";

  const audioDiv = createDiv('');
  const updateButton = createButton('Update');
  createSpan('Audio :').parent(audioDiv);

  audioDiv.addClass('option-audio');
  const audioInput = createFileInput((file) => {
    audioData = file.data;
  }).parent(audioDiv);


  updateButton
    .parent(audioDiv)
    .mousePressed(() => {
      socket.emit('update note', audioData);
    });
}
