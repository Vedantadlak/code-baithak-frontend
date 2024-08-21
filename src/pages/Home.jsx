import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { v4 as uuid } from "uuid";
import { useGlobalContext } from "../context/GlobalContext";
import AppTitle from "../component/AppTitle";

function Home() {
  const navigate = useNavigate();
  const { userName, setUserName } = useGlobalContext();
  const [roomId, setroomId] = useState("");

  const createRoomId = () => {
    const id = uuid();
    setroomId(id);
    toast.success("Room id created succefully");
  };

  const joinRoom = () => {
    if (!roomId || !userName) {
      toast.error("Room id and username required");
      return;
    }
    navigate(`/editor/${roomId}`);
  };

  const handleEnterButton = (e) => {
    if (e.code == 'Enter') {
      joinRoom()
    }
  }

  return (
    <>
      {/* main container */}
      <div className='w-full h-[100vh]' style={{
        backgroundImage : 'url(/bgHome.jpg)',
        backgroundSize : "cover",
        backgroundPosition : "center"
      }}>
        <div className="w-full h-full flex flex-col justify-center items-center bg-black/70 backdrop-blur-lg backdrop-filter">
          {/* input container */}
          <div className='flex flex-col justify-center items-center w-[300px] sm:w-[400px] md:w-[600px] h-auto bg-slate-900/50 border border-emerald-400/20 backdrop-filter backdrop-blur-lg shadow-xl text-white px-8 py-8 gap-4 rounded-lg'>
            {/* logo and app name */}
            <AppTitle />
            <h4 className="text-xs sm:text-sm font-medium text-yellow-400">Paste invitation room id below !</h4>

            {/* input group */}
            <div className='flex flex-col justify-center items-center w-full  gap-4'>
              <input
                className='w-full px-4 py-2 sm:py-3 placeholder:text-yellow-400/50 text-yellow-400 rounded-md bg-emerald-950/30 focus:bg-black/50 backdrop-filter backdrop-blur-sm outline-none border border-emerald-900 focus:border-emerald-600/30 '
                type='text'
                title='create or type your room id here'
                placeholder='Enter room id'
                onChange={(e) => setroomId(e.target.value)}
                value={roomId}
                onKeyUp={handleEnterButton}
              />

              <input
                className='w-full px-4 py-2 sm:py-3 placeholder:text-yellow-400/50 text-yellow-400 rounded-md bg-emerald-950/30 focus:bg-black/50 backdrop-filter backdrop-blur-sm outline-none border border-emerald-900 focus:border-emerald-600/30 '
                type='text'
                title='what username would you want to join with ?'
                placeholder='Enter username'
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
                onKeyUp={handleEnterButton}
              />

              <div className='w-full flex justify-end'>
                <button
                  className='bg-gradient-to-br from-emerald-600/20 to-orange-600/20 backdrop-filter backdrop-blur-md shadow hover:shadow-lg hover:bg-emerald-800/20 transition-all text-sm sm:text-base px-6 py-[6px] sm:px-10 sm:py-2 rounded-md'
                  title="join the room"
                  onClick={joinRoom}
                >
                  Join
                </button>
              </div>

              <span className='text-xs sm:text-sm'>
                If you dont't have an invite please create{" "}
                <a
                  className='text-sky-600 hover:text-sky-500 transition-all'
                  href='#'
                  onClick={createRoomId}
                  title="Click or Press Enter to join the room"
                >
                  new room
                </a>{" "}
              </span>
            </div>
          </div>

          <footer className='mt-16 shadow px-3 text-sm md:text-base md:px-9 py-3 rounded-md backdrop-filter backdrop-blur-md bg-emerald-900/30'>
            <h4 className='text-sky-500' title="connect with me on twitter(x.com)">
              Developed with <span className="animate-pulse">❤️</span> by
              <Link to='https://x.com/AnmolDotX' className="text-orange-400 font-bold tracking-widest hover:text-orange-500"> Anmol Kumar </Link>
            </h4>
          </footer>
        </div>
      </div>
    </>
  );
}

export default Home;
