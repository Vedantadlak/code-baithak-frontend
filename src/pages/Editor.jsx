import React, { useEffect, useRef, useState } from "react";
import AppTitle from "../component/AppTitle";
import Client from "../component/Client";
import EditorComponent from "../component/EditorComponent";
import { initSocket } from "../helpers/socket";
import { ACTIONS } from "../helpers/SocketActions.js";
import { useGlobalContext } from "../context/GlobalContext";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  executeJSCode,
  executeJavaCode,
  executePythonCode,
} from "../helpers/api.js";
import ChatBox from "../component/ChatBox";

function Editor() {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const outPutRef = useRef(null);
  const dataContext = useGlobalContext();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);

  const [clients, setClients] = useState([
    {
      socketId: 1,
      username: "X",
    },
  ]);

  const phoneStyle = "absolute w-full z-10 block";
  const [menu, setMenu] = useState(false);
  const [displayChat, setDisplayChat] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Connection to server failed, try again later.");
        navigate("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: dataContext.userName,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          setClients(clients);
          console.log(username);

          if (username !== dataContext.userName) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }

          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            socketId,
            code: codeRef.current,
          });

          socketRef.current.on(ACTIONS.OUTPUT_CODE, ({ output }) => {
            if (output) {
              outPutRef.current.value = output;
            }
          });
        }
      );

      socketRef.current.on(ACTIONS.CHAT_MESSAGE, ({ username, message }) => {
        setMessages((prev) => [...prev, { username, message }]);
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => prev.filter((client) => client.socketId !== socketId));
      });
    };

    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.off(ACTIONS.CHAT_MESSAGE);
    };
  }, []);

  const RunCode = async () => {
    try {
      const code = codeRef.current;
      let data = "";
      if (selectedLanguage === "javascript") {
        data = await executeJSCode(code);
      } else if (selectedLanguage === "python") {
        data = await executePythonCode(code);
      } else if (selectedLanguage === "java") {
        data = await executeJavaCode(code);
      }
      
      outPutRef.current.value = data.run.output;

      socketRef.current.emit(ACTIONS.OUTPUT_CODE, {
        roomId,
        output: outPutRef.current.value,
      });
    } catch (err) {
      toast.error("Error running code: " + err.message);
      console.error("Error running code:", err);
    }
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  };

  const leave = () => {
    navigate("/");
  };

  const handleLangChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  return (
    <div className='w-full h-[100vh]' style={{
      backgroundImage: 'url("/codelogo.png")',
      backgroundPosition: "center",
      backgroundSize: "cover",
    }}>
      <div className='w-full h-full flex bg-slate-950/90 backdrop-filter backdrop-blur-sm'>
        <aside className='text-white pl-2 pt-2 md:hidden'>
          <button
            className='font-bold text-2xl text-orange-700 rounded-md px-2 pb-1 transition-all'
            onClick={() => setMenu(!menu)}
          >
            {menu ? "X" : "="}
          </button>
        </aside>

        <aside className={`bg-emerald-950/20 backdrop-filter backdrop-blur-lg md:w-[20vw] h-full md:flex flex-col justify-between py-4 px-4 ${
          menu ? phoneStyle : "hidden"
        }`}>
          <div>
            <div className='flex'>
              <AppTitle />
              <div className='w-[40%] flex justify-end md:hidden  '>
                <h1
                  className='rounded-md text-md px-2 my-auto bg-ButtonColor'
                  onClick={() => setMenu((prev) => !prev)}
                >
                  X
                </h1>
              </div>
            </div>
            <div className='text-white mt-2'>
              <h2 className='font-bold my-4 text-orange-400'>
                Connected Users
              </h2>
              <div className='flex flex-col gap-2 bg-gradient-to-b from-emerald-900/20 to-transparent h-[60vh] rounded-md rounded-b-none overflow-auto backdrop-filter backdrop-blur-md '>
                {clients &&
                  clients.map((client) => (
                    <Client
                      key={client.socketId}
                      username={client.username}
                    />
                  ))}
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-2 mt-2'>
            <button
              className='bg-black/50 border-emerald-500/50 border text-sm text-white hover:text-sky-600 px-10 py-2 rounded-md transition-all'
              onClick={copyRoomId}
            >
              Copy Room Id
            </button>
            <button
              className='bg-gradient-to-br from-red-500/30 border border-red-500/50 to-transparent backdrop-filter backdrop-blur-sm shadow hover:shadow-lg hover:text-red-200 px-10 py-2 rounded-md text-white font-bold transition-all duration-300'
              onClick={leave}
            >
              Leave
            </button>
          </div>
        </aside>

        <aside className='flex w-[80vw] flex-col'>
          <div className='flex justify-between items-center'>
            <select
              onChange={handleLangChange}
              value={selectedLanguage}
              className='bg-blue-600/50 backdrop-filter backdrop-blur-sm hover:shadow-blue-700 shadow hover:shadow-2xl transition-all hover:bg-blue-600/40 px-10 py-2 rounded-md my-2 text-white font-bold active:bg-blue-600/80 active:shadow-blue-600'
            >
              <option className='bg-black/70 text-orange-600' value='javascript'>
                Javascript {"(Node 18)"}
              </option>
              <option className='bg-black/70 text-orange-600' value='python'>
                Python 3
              </option>
              <option className='bg-black/70 text-orange-600' value='java'>
                Java 15
              </option>
            </select>
            <button
              className='bg-green-600/50 backdrop-filter backdrop-blur-sm hover:shadow-green-700 shadow hover:shadow-2xl transition-all hover:bg-emerald-600/40 px-10 py-2 rounded-md my-2 text-white font-bold active:bg-emerald-600/80 active:shadow-green-600'
              onClick={RunCode}
            >
              {"> Run"}
            </button>
          </div>
          <div className='w-full rounded-md'>
            <EditorComponent
              socketRef={socketRef}
              roomId={roomId}
              onCodeChange={(code) => (codeRef.current = code)}
            />
          </div>
          <div className='h-[40vh]'>
            <textarea
              className='w-full h-[95%] bg-black/60 backdrop-filter backdrop-blur-sm text-white outline-none rounded-md px-6 my-2'
              placeholder='output:'
              id='OutputBox'
              ref={outPutRef}
            ></textarea>
          </div>
        </aside>
        <div className='absolute top-[89%] right-[5%] md:hidden'>
          <button
            className='bg-ButtonColor rounded-full px-4 py-4 '
            onClick={() => setDisplayChat((prev) => !prev)}
          >
            <i className='fa-brands fa-rocketchat '></i>
          </button>
        </div>

        <ChatBox
          messages={messages}
          socketRef={socketRef}
          roomId={roomId}
          setDisplayChat={setDisplayChat}
          displayChat={displayChat}
          phoneStyle={phoneStyle}
        />
      </div>
    </div>
  );
}

export default Editor;