import React from 'react'
import Avatar from 'react-avatar'
function Client({username}) {
  return (
    <div className='flex items-center gap-2 m-2 bg-emerald-950 py-2 px-3 rounded-md relative'>
        <Avatar name={username} size={40} round="20px" />
        <span className='mt-2 h-full'>{username.split(' ')[0]}</span>
        <div title={`${username} is online`} className='absolute h-2 w-2 rounded-full bg-green-500 right-4'></div>
    </div>
  )
}

export default Client