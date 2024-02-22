import React from 'react'
import Avatar from 'react-avatar';


function Users(name) {
  return (
    <div className='user'>
        <Avatar name={name.name} size={40} round="12px"/> 
        <span className='username'>{name.name}</span>
    </div>
  )
}

export default Users
