import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import initSocket from '../Socket';
import Actions from '../Action';
import toast from 'react-hot-toast';
import Editor from '../components/Editor';
import Sidebar from '../components/Sidebar';


function JoinRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const socketRef = useRef(null)
    const [users, setUsers] = useState([])
    const codeRef = useRef(null)
    const inputRef = useRef(null)
    const outputRef = useRef(null)
    const language = useRef(null)

    useEffect(() => {
        async function checkAuth() {
            const token = localStorage.getItem("token")
            const username = localStorage.getItem("name")
            const id = localStorage.getItem("id");

            if (token != null && username != null && id != null) {
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
                        }
                    }
                } catch (error) {
                    toast.error(error)
                }
            } else {
                navigate("/login")
            }
        }
        checkAuth()
    }, [])

    useEffect(() => {
        const id = localStorage.getItem("id");
        const name = localStorage.getItem("name")
        const token = localStorage.getItem("token")
        const init = async () => {
            console.log("id from local ", id)
            socketRef.current = await initSocket()
            socketRef.current.on("connect_error", (err) => handleError(err));
            socketRef.current.on("connect_failed", (err) => handleError(err));
            socketRef.current.emit(Actions.JOIN, { roomId, name, id })

            // dissconnected user
            socketRef.current.on(Actions.DISCONNECTED, ({ socketId, name }) => {
                toast.success(name + " left the room", {
                    duration: 2000,
                    position: "top-right"
                })
                setUsers((prev) => {
                    return prev.filter(user => user.socketId != socketId)
                })
            })
            // joined users
            socketRef.current.on(Actions.JOINED, ({ clients, userId, name }) => {
                // console.log(socketId)
                setUsers(clients)
                console.log(userId + " from server")
                console.log(id + " from local")
                if (userId != id) {
                    toast.success(name + " joined room", {
                        duration: 2000,
                        position: "top-right"
                    })
                }
                const code = codeRef.current
                const input = inputRef.current
                const output = outputRef.current
                const lang = language.current
                // console.log(language)
                socketRef.current.emit(Actions.SYNC_CODE, ({ code,lang, roomId }))
                socketRef.current.emit(Actions.INPUT_CHANGE, ({ input, roomId }))
                socketRef.current.emit(Actions.OUTPUT_CHANGE, ({ output, roomId }))
                // socketRef.current.emit(Actions.LANGUAGE_SYNC, ({ lang, roomId }))
            })

            function handleError(err) {
                console.log("socket err ", err)
                toast.error("Socket connection failed, try again later")
                navigate("/")
            }
        }
        if (id != null && name != null && token != null) {
            init();
            return () => {
                socketRef.current.disconnect();
                socketRef.current.off(Actions.JOINED);
                socketRef.current.off(Actions.DISCONNECTED);
            }
        }
    }, [])

    return (
        <div className='editorPage dark'>
            <Sidebar users={users} />
            <Editor onCodeChange={(code) => { codeRef.current = code; }} onInputChange={(input) => { inputRef.current = input; }} onOutputChange={(output) => { outputRef.current = output }} onLangChange={(value) => {language.current= value}} socketRef={socketRef} roomId={roomId} />
        </div>

    )
}

export default JoinRoom
