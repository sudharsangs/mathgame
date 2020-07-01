const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

const { createQuestion, getRandomNumber } = require("./helper_functions");

let players = [];

let question = createQuestion();

console.log(question);

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "/views/index.html"));
});

io.on("connection", (socket) => {
  socket.on("user_joined", (name) => {
    const player = {
      id: socket.id,
      name,
      points: 0,
    };

    players.push(player);

    console.log(name, "is now connected");

    console.log(players);

    updateGame();
  });

  socket.on("response", (response) => {
    // do something with the response
    console.log(response);

    // check if the response is the answer
    if (+response === question.answer) {
      question = createQuestion();

      increasePoints(socket.id);

      updateGame();
    } else {
      decreasePoints(socket.id);
      updateGame();
    }
  });

  socket.on("disconnect", () => {
    // remove the player from the local array
    // players = [...players.filter((player) => player.id !== socket.id)];

    console.log(socket.id, " disconnected");
  });
});

const increasePoints = (id) => {
  players = players.map((player) => {
    if (player.id === id) {
      return {
        ...player,
        points: player.points + 1,
      };
    } else {
      return player;
    }
  });
};

const decreasePoints = (id) => {
  players = players.map((player) => {
    if (player.id === id) {
      return {
        ...player,
        points: 0,
      };
    } else {
      return player;
    }
  });
};

const updateGame = () => {
  const leaderboard = players.sort((a, b) => b.points - a.points).slice(0, 10);

  io.emit("question", question.expression);
  io.emit("leaderboard", leaderboard);
};

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
