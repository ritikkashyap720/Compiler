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
const { checkAuth } = require("./middleware/auth");
app.use(cors());

// db connect
connectDB("mongodb://localhost:27017/compiler").then(console.log("Database connected")).catch((err) => { console.log("Error:", err) })

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});




io.on("connection", (socket) => {
  socket.on("joinRoom", (room) => {
    socket.join(room)
    socket.to(room).emit("userJoined",socket.id)
  })
  socket.on("sendCode", ({ code, roomId }) => {
    console.log(code + " from " + socket.id)
    socket.to(roomId).emit("updateCode", code)
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