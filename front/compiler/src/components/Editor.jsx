import React, { useEffect, useRef, useState } from 'react'
import MonacoEditor from '@monaco-editor/react';
import "../App.css"
import Actions from '../Action';
import toast from 'react-hot-toast';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

function Editor({ socketRef, roomId, onCodeChange, onInputChange, onOutputChange }) {
  const [code, setCode] = useState("#write your python code here")
  const [input, setInput] = useState(" ")
  const [output, setOutput] = useState(" ")
  const [language, setLanguage] = useState("python")
  const [dropdown, setDropdown] = useState(false)

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
    if (lang === "python") {
      setCode("#write your python code here")
    } else if (lang === "c++") {
      setCode("//write your c++ code here")
    } else if (lang === "java") {
      setCode("//write your java code in main class \nclass Main {\npublic static void main(String[] args) {\n\n}\n}")
    }
    setLanguage(lang)
    setDropdown(false)
  };
  const showDropDown = () => {
    dropdown?setDropdown(false):setDropdown(true)
  }
  const hideDropDown = () => {
    setDropdown(false)
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`http://localhost:5173/editor/${roomId}`);
      toast.success("Copied to clipboard", {
        duration: 1000
      })
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }

  return (
    <div className='editor'>
      <div className="editorNavbar">
        <div className='loginedUser'>Hello {username}, happy coding 😊.</div>
        <div className="leftbuttons">
          <button className="leftBtns share" onClick={handleShare}>Share</button>
          <button className="leftBtns execute" onClick={handleCodeCompilation}>Execute</button>
          <button className='select' onClick={showDropDown}>{language} <ArrowDropDownRoundedIcon/></button>
          {dropdown && <div className="dropdown">
            <button onClick={handleSelectLanguage} className="dropdowns" value="python" >Python</button>
            <button onClick={handleSelectLanguage} className="dropdowns" value="c++">C++</button>
            <button onClick={handleSelectLanguage} className="dropdowns" value="java">Java</button>
          </div>}

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
