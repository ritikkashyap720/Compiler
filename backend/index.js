const router = require("./routes/routes");
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const PORT = 8000;
const server = http.createServer(app);
const connectDB = require("./connection/connection");
const user = require("./routes/user");
const Actions = require("./Action")
const { checkAuth } = require("./middleware/auth");
app.use(cors());

// db connect
connectDB("mongodb://localhost:27017/compiler").then(console.log("Database connected")).catch((err) => { console.log("Error:", err) })

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// get all connected user in room

function getAllConnectedUser(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
    return {
      socketId,
      name: userSocketMap[socketId].name,
      id: userSocketMap[socketId].id
    }
  })
}

// user socket map

const userSocketMap = {};


io.on("connection", (socket) => {
  socket.on(Actions.JOIN, ({ roomId, name, id }) => {
    const userId = id
    socket.join(roomId)
    userSocketMap[socket.id] = { id, name }
    const clients = getAllConnectedUser(roomId)
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(Actions.JOINED, { clients, name, userId, socketId: socket.id })
    })

  })

  // code change
  socket.on(Actions.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(Actions.CODE_CHANGE, code)
  })
  // front-end-code-change
  socket.on(Actions.FRONT_END_CODE,({html,css,js,roomId})=>{
    socket.in(roomId).emit(Actions.FRONT_END_CODE,{html,css,js})
  })
  // input change
  socket.on(Actions.INPUT_CHANGE, ({ roomId, input }) => {
    socket.in(roomId).emit(Actions.INPUT_CHANGE, input)
  })
  // output change
  socket.on(Actions.OUTPUT_CHANGE,({roomId,output})=>{
    socket.in(roomId).emit(Actions.OUTPUT_CHANGE,output)
  })

  // language change
  socket.on(Actions.LANGUAGE_CHANGE,({lang,roomId})=>{
    socket.in(roomId).emit(Actions.LANGUAGE_CHANGE,lang)
  })

  // language sync
  // socket.on(Actions.LANGUAGE_SYNC,({lang,roomId})=>{
  //   socket.in(roomId).emit(Actions.LANGUAGE_CHANGE,lang)
  // })

  // code sync

  socket.on(Actions.SYNC_CODE, ({ code,lang, roomId }) => {
    socket.in(roomId).emit(Actions.CODE_CHANGE, code)
    socket.in(roomId).emit(Actions.LANGUAGE_CHANGE,lang)
  })

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms]
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(Actions.DISCONNECTED, ({
        socketId: socket.id,
        name: userSocketMap[socket.id]?.name
      }))
    })
    delete userSocketMap[socket.id]
    socket.leave();
  })
});



// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


// Routes

app.use("/compile", router)
app.use("/user", user)

app.use("/auth", checkAuth)

server.listen(PORT, () => console.log(`Server started at port ${PORT}`))