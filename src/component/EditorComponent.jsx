import React, { useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { tokyoNightStorm } from "@uiw/codemirror-themes-all";
import { ACTIONS } from "../helpers/SocketActions.js";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";

function EditorComponent({ socketRef, roomId, onCodeChange }) {
  const [value, setValue] = React.useState("");

  const onChange = React.useCallback((code, viewUpdate) => {
    onCodeChange(code);
    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code,
    });

    setValue(code);
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          setValue(code);
        }
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <CodeMirror
      className='text-lg border border-black'
      value={value}
      height='60vh'
      theme={tokyoNightStorm}
      extensions={[javascript({ jsx: true, typescript : true }), python(), java(), cpp()]}
      onChange={onChange}
    />
  );
}

export default EditorComponent;
