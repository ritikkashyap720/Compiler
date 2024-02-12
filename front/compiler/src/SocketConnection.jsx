import React from 'react'
import { io } from "socket.io-client";

const URL = "http://localhost:8000";

function SocketConnection() {
    return (io(URL))
}

export default SocketConnection
