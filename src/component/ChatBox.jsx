import React, { useEffect, useRef } from 'react'
import Avatar from 'react-avatar'
import { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { ACTIONS } from '../helpers/SocketActions';

function ChatBox({ messages, socketRef, roomId, displayChat, setDisplayChat, phoneStyle }) {

    const [input, setInput] = useState([])
    const { userName } = useGlobalContext();
    const messagesEndRef = useRef(null);

    const addListItem = (e) => {
        e.preventDefault();
        if (input) {
            socketRef.current.emit(ACTIONS.CHAT_MESSAGE, { roomId, message: input, username: userName });
            setInput('');
        }
    };


    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <>
            <aside className={`bg-PrimaryColor  md:w-[450px] h-full md:flex flex-col justify-between  py-4 px-4 ml ${displayChat ? phoneStyle : 'hidden'} `}>
                {/* chatbox title */}
                    <div className='flex justify-around'>
                        <h4 className='font-bold text-xl text-orange-400 text-center mt-2'>Chat Box</h4>
                        <div className='w-[40%] flex justify-end md:hidden'>
                            <h1 className='bg-ButtonColor text-md px-2 my-auto' onClick={() => setDisplayChat((prev) => !prev)}>X</h1>
                        </div>  
                    </div>

                <div id='chatbox' className='flex flex-col w-[98%]  h-[90vh] overflow-auto bg-gradient-to-b from-emerald-800/20 backdrop-filter backdrop-blur to-transparent rounded-lg rounded-b-none mt-2 md:m-1' >
                    {
                        messages && messages.map((message, index) => (
                            <div key={index} className={`${message.username == userName ? "justify-end" : "justify-Start"} flex gap-4 my-2 mx-2 `}>
                                <Avatar name={message.username} size={30} round="14px" className='ml-2 my-auto' />
                                <div className={`flex flex-col gap-2   text-white px-2 text-md font-thin my-auto  `}>
                                    <p className='text-[10px]  font-thin text-white'>{message.username}</p>
                                    <div className={`${message.username == userName ? "bg-emerald-950 backdrop-filter backdrop-blur text-white" : "bg-slate-950 text-white"}  h-auto  px-4 py-4 rounded-md text-sm  `}>
                                        {`${message.message}`}
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                    <div ref={messagesEndRef} />
                </div>

                <div className='mt-2 w-full border border-green-600/50 rounded-e-full'>
                    <form onSubmit={addListItem} className='flex'>
                        <input className='w-full bg-slate-950/50 backdrop-filter backdrop-blur outline-none rounded-md px-4 py-2 text-white ' type="text" placeholder='chat message' onChange={(e) => setInput(e.target.value)} value={input} />
                        <button className='bg-green-800 hover:bg-green-600 transition-all duration-300 px-5 py-2 rounded-e-full text-white text-sm font-bold' type='submit'>{">"}</button>
                    </form>
                </div>

            </aside>
        </>
    )
}

export default ChatBox