let express = require("express");
let path = require("path");
let app = express();
let server = require("http").Server(app);

let poll = require('./poll')

let poll2 = require('./poll2')

let poll3 = require('./poll3');

pollArray = []

pollArray.push(poll);
pollArray.push(poll2);
pollArray.push(poll3);

let io = require("socket.io")(server);

let port = 8080;

app.use("/", express.static(path.join(__dirname, "dist/VoteApp")));


// Takes care of new connection to io
io.on("connection", socket => {
  //console.log("new connection made from client with ID="+socket.id);
  socket.broadcast.emit('newSocketID', "New connection made client = " + socket.id);
  io.sockets.emit("poll", pollArray);
  //console.log(pollArray[0].options[0].count);

  socket.on("vote", (data) => {
    //console.log(data.num);
    //onsole.log(data.selection);
    
    pollArray[data.num].options[data.selection].count +=1;
    
    //console.log(pollArray[data.num].options[data.selection].count)
    io.sockets.emit("poll", pollArray);
  });
});

server.listen(port, () => {
  //console.log("Listening on port " + port);
});

function getCurrentDate() {
  let d = new Date();
  return d.toLocaleString();
}