import React, { useEffect, useRef, useState } from 'react'
import MonacoEditor from '@monaco-editor/react';
import "../App.css"
import Actions from '../Action';


function Editor({ socketRef, roomId, onCodeChange, onInputChange, onOutputChange }) {
  const [code, setCode] = useState("#write your python code here")
  const [input, setInput] = useState(" ")
  const [output, setOutput] = useState(" ")
  const [language, setLanguage] = useState("python")

  const username = localStorage.getItem("name")
  const handleChange = (code) => {
    onCodeChange(code)
    setCode(code)
    if (socketRef.current && code != null) {
      socketRef.current.emit(Actions.CODE_CHANGE, ({ code, roomId }))
    }
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    onInputChange(e.target.value)
    const input = e.target.value
    if (socketRef.current) {
      socketRef.current.emit(Actions.INPUT_CHANGE, ({ input, roomId }))
    }
  }

  useEffect(() => {
    var textInput = document.getElementById("input")
    if (socketRef.current) {
      socketRef.current.on(Actions.CODE_CHANGE, (code) => {
        if (code !== null) {
          setCode(code)
          onCodeChange(code)
          console.log(code)
        }
      });
      socketRef.current.on(Actions.INPUT_CHANGE, (input) => {
        if (input !== null) {
          setInput(input)
          onInputChange(input)
          textInput.value = input
        }
      });
      socketRef.current.on(Actions.OUTPUT_CHANGE, (output) => {
        if (output !== null) {
          setOutput(output)
          onOutputChange(output)
        }
      })
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off(Actions.CODE_CHANGE);
      }
    };
  }, [socketRef.current]);

  const handleCodeCompilation = async () => {
    const response = await fetch('http://localhost:8000/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        input: input,
        code: code,
        language: language
      })
    });
    if (response) {
      const result = await response.json()
      if (result.output) {
        const output = result.output
        if (socketRef.current) {
          socketRef.current.emit(Actions.OUTPUT_CHANGE, ({ output, roomId }))
        }
        setOutput(output)
        onOutputChange(output)
      } else if (result.error) {
        const output = result.error
        if (socketRef.current) {
          socketRef.current.emit(Actions.OUTPUT_CHANGE, ({ output, roomId }))
        }
        setOutput(output)
        onOutputChange(output)
      } else {
        setOutput("Write some code")
      }
    }
  }

  const handleSelectLanguage = (event) => {
    const lang = event.target.value;
    if(lang==="python"){
      setCode("#write your python code here")
    }else if(lang==="c++"){
      setCode("//write your python code here")
    }else if(lang==="java"){
      setCode("//write your python code here \nclass Main {\npublic static void main(String[] args) {\n\n}}")
    }
    setLanguage(lang)
  };

  return (
    <div className='editor'>
      <div className="editorNavbar">
        <div className='loginedUser'>Hello {username}, happy coding 😊.</div>
        <div className="leftbuttons">
          <button className="leftBtns share">Share</button>
          <button className="leftBtns execute" onClick={handleCodeCompilation}>Execute</button>
          <select className='select' value={language} onChange={handleSelectLanguage}>
            <option className='options' value="python">Python</option>
            <option className='options' value="c++">C++</option>
            <option className='options' value="java">Java</option>
          </select>
        </div>
      </div>
      <MonacoEditor
        height="70%"
        width="100%"
        defaultLanguage={language}
        value={code}
        theme='vs-dark'
        onChange={handleChange}
      />
      <textarea id="input" placeholder='enter you inputs here' onChange={handleInputChange} />
      <div>
        {output}
      </div>
    </div>
  )
}

export default Editor
