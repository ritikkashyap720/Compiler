import React from 'react'
import Users from './Users'
import { useNavigate } from 'react-router-dom'

function Sidebar({ users }) {
  const navigate = useNavigate()

  function handleLeaveRoom(){
    navigate("/")
  }

  return (
    <div className='sidebar'>
      <div className='sidebarTop'>
        <div className="navbar">Logo</div>
        <div className="userList">
          Connected users
          <div className="list">
            {users.map((user, index) => (<Users key={index} name={user.name} />))}
          </div>
        </div>
      </div>
      <div className="bottomButtons">
        <button className='leave btn' onClick={handleLeaveRoom}>Leave Room</button>
      </div>
    </div>
  )
}

export default Sidebar
