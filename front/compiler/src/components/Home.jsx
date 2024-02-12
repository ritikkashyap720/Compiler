import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


function Home() {
    const navigate = useNavigate();
    const [joinRoomID,setJoinRoomID] = useState("")
    
    
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
    function sendMessage() {
        const uniqueId = uuidv4();
        setJoinRoomID(uniqueId);
        console.log(uniqueId)
    }

    const [roomName, setRoomName] = useState('');

    const handleChange = (e) => {
        setRoomName(e.target.value)
    };

    const handleJoinRoom = (e) => {
        e.preventDefault();
        if(roomName.trim()!==""){
            navigate(`/${roomName}`)
        }
    };


    return (
        <div>
            <form onSubmit={handleJoinRoom}>
                <input
                    type="text"
                    placeholder="Enter room name"
                    value={roomName}
                    onChange={handleChange}
                />
                <button type="submit">Join Room</button>
            </form>

            <button onClick={sendMessage}>Create Room</button>
            {joinRoomID && <Link to={`${joinRoomID}`}>{joinRoomID}</Link>}
        </div>
    )
}

export default Home
