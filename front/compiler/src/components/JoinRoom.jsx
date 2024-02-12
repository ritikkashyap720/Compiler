import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import SocketConnection from '../SocketConnection';
import Editor from '@monaco-editor/react';

function JoinRoom() {
    const { roomId } = useParams();
    const socket = SocketConnection();
    const navigate = useNavigate();
    const [code, setCode] = useState("//comments")

    useEffect(() => {
        async function checkAuth() {
            const token = localStorage.getItem("token")
            if (token) {
                try {
                    const response = await fetch('http://localhost:8000/auth', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response) {
                        const result = await response.json()
                        if (result.msg == "unauthorized") {
                            navigate("/login")
                        } else {
                            socket.emit("joinRoom", roomId)
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                navigate("/login")
            }
        }
        checkAuth()
    }, [])

    socket.on("userJoined", (e) => {
        console.log(socket.id,"joined")
    })

    socket.on("sendCode", (e) => {
        console.log(e)
    })



    const handleCodeChange=(e)=> {
        var code = e.target.value;
        socket.emit("sendCode", { code, roomId });
        setCode(code)
        console.log(code+" from "+socket.id)
    }


    return (
        // <Editor
        //     height="90vh"
        //     width={"500px"}
        //     defaultLanguage="javascript"
        //     value={code}
        //     onChange={(value) => { setCode(value), handleCodeChange(value) }}
        //     theme='vs-dark'
        // />
        <input
        type="text"
        placeholder="Enter room name"
        value={code}
        onChange={handleCodeChange}
    />
    )
}

export default JoinRoom
