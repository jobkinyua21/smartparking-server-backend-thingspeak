const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4000;
const index = require("./route/index");

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

let interval;
io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 10000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const getApiAndEmit = async (socket) => {
  try {
    const res = await axios.get(
      "https://api.thingspeak.com/channels/1423651/feeds.json?api_key=46SG57CLLJ2DON2I&results=2"
      
    );
    socket.emit("Data", res.data.feeds[1]);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

server.listen(port, () => console.log(`Port ${port} is active...`));
