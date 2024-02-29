import {io} from "socket.io-client";

const initSocket = async ()=>{
    const options ={
        "force new connection":true,
        reconnectionAttempt:"Infinity",
        timeout:1000,
        transports:['websocket'],
    }
    return io("http://localhost:8000/",options)
}
export default initSocket