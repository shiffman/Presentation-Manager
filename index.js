const express = require("express");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

const server = app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
app.use(express.static("public"));
app.use(express.json());

const io = require("socket.io")(server);
let session;

// stop flag to halt student counter
let stopFlag = false;

// someonre is presenting
let startedFlag = false;

app.get("/session", (request, response) => {
  session = JSON.parse(fs.readFileSync("schedule-sample.json", "utf-8"));
  response.json(session);
});

io.on("connection", (socket) => {
  console.log("New client: " + socket.id);
  socket.on("new presenter", (data) => {
    if (startedFlag) {
      console.log("already presenting stop this one first!");
    } else {
      console.log(data);
      startPresenter(data);
    }
  });
  socket.on("stop presenter", (data) => {
    stopFlag = true;
    console.log("stopped");
    io.emit("stop presenter", "done");
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected " + socket.id);
  });
  socket.on("storeSession", (data) => {
    storeSession(data);
  });
});

function storeSession(data) {
  // console.log("Saving", data);
  fs.writeFileSync("schedule-sample.json", JSON.stringify(data), {
    flag: "w",
    encoding: "utf8",
  });
}

async function startPresenter(data) {
  session = JSON.parse(fs.readFileSync("schedule-sample.json", "utf-8"));

  startedFlag = true;
  let index = 0;
  for (let i in session["presenters"]) {
    if (session["presenters"][i].name == data["name"]) index = i;
  }
  let presenter = session["presenters"][index];
  presenter["minutes"] = parseInt(data["minutes"]);
  presenter["seconds"] = parseInt(data["seconds"]);

  while (presenter["minutes"] !== 0 || presenter["seconds"] !== 0) {
    // console.log("running");
    // break if a stop signal is sent
    if (stopFlag) {
      break;
    }
    // sleep for 1s
    await new Promise((r) => setTimeout(r, 1000));

    if (presenter["seconds"] == 0) {
      presenter["minutes"]--;
      presenter["seconds"] = 60;
    }

    presenter["seconds"]--;

    session["presenters"][index] = presenter;
    io.emit("user", presenter);
    io.emit("admin", session);
    storeSession(session);
  }

  session["presenters"][data["name"]] = presenter;
  io.emit("user", presenter);
  io.emit("admin", session);
  storeSession(session);

  startedFlag = false;
  stopFlag = false;
}
