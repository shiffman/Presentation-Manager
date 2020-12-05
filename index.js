const express = require('express');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
app.use(express.static('public'));
app.use(express.json());

const io = require('socket.io')(server);

const session = JSON.parse(fs.readFileSync('schedule-sample.json', 'utf-8'));

app.get('/session', (request, response) => {
  response.json(session);
});

io.on('connection', (socket) => {
  console.log('New client: ' + socket.id);

  socket.on('new presenter', (data) => {
    console.log(data);
    io.emit('start presenter', data);
  });

  socket.on('update note', (data) => {
    console.log(data);
    io.emit('update note', data);
  });

  socket.on('disconnect', function () {
    console.log('Client disconnected ' + socket.id);
  });

});
