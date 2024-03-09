import React, { useEffect, useRef, useState } from 'react'
import MonacoEditor from '@monaco-editor/react';
import "../App.css"
import Actions from '../Action';
import toast from 'react-hot-toast';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import htmlLogo from "../assets/icons/html.png"
import cssLogo from "../assets/icons/css-3.png"
import jsLogo from "../assets/icons/js.png"
import python from "../assets/icons/python.png"
import java from "../assets/icons/java.png"
import cplusplus from "../assets/icons/c++.png"

function Editor({ socketRef, roomId, onCodeChange, onInputChange, lang, onOutputChange,onLanguageChange }) {
  const [code, setCode] = useState("#write your python code here")
  const [input, setInput] = useState(" ")
  const [output, setOutput] = useState(" ")
  const [language, setLanguage] = useState(lang?lang:"python")
  const [dropdown, setDropdown] = useState(false)
  const [front, setFront] = useState(false)
  // for front end editor
  const [htmlCode, setHtmlCode] = useState('<!-- write your html here -->')
  const [cssCode, setCssCode] = useState('/* write your css here */')
  const [jsCode, setJsCode] = useState('//write your js here')
  const [fileIconImage, setFileIconImage] = useState(python)

  // debounce function which will wait 8000ms

  const myDebounce = (cb, delay) => {
    let timer;
    return function (...args) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        cb(...args)
      }, delay)
    }
  }


  const username = localStorage.getItem("name")
  const handleChange = myDebounce((code) => {
    onCodeChange(code)
    setCode(code)
    if (socketRef.current && code != null) {
      socketRef.current.emit(Actions.CODE_CHANGE, ({ code, roomId }))
    }
  }, 800)



  const handleInputChange = (e) => {
    setInput(e.target.value)
    onInputChange(e.target.value)
    const input = e.target.value
    if (socketRef.current) {
      socketRef.current.emit(Actions.INPUT_CHANGE, ({ input, roomId }))
    }
  }
  onLanguageChange(language)
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
      socketRef.current.on(Actions.LANGUAGE_CHANGE, (lang) => {
        onLanguageChange(lang)
        setLanguage(lang)
        if (lang != "HTML, CSS& JS") {
          setFront(false)
        }
      
      })
      
      socketRef.current.on(Actions.LANGUAGE_SYNC,(lang)=>{
        if(lang!=null){
          onLanguageChange(lang)
          console.log(lang)
          setLanguage(lang)
           if (lang != "HTML, CSS& JS") {
          setFront(false)
        }
        }
      })

      socketRef.current.on(Actions.FRONT_END_CODE_HTML, (html) => {
        if (htmlCode != html) {
          setHtmlCode(html)
        }
      })
      socketRef.current.on(Actions.FRONT_END_CODE_CSS, (css) => {
        if (cssCode != css) {
          setCssCode(css)
        }
      })
      socketRef.current.on(Actions.FRONT_END_CODE_JS, (js) => {
        if (jsCode != js) {
          setJsCode(js)
        }
      })
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off(Actions.CODE_CHANGE);
      }
    };
  }, [socketRef.current]);

  useEffect(() => {
    if (language === "python") {
      setCode("#write your python code here")
      setFileIconImage(python)
    } else if (language === "c++") {
      setCode("//write your c++ code here")
      setFileIconImage(cplusplus)
    } else if (language === "java") {
      setFileIconImage(java)
      setCode("//write your java code in main class \nclass Main {\npublic static void main(String[] args) {\n\n}\n}")
    } else if (language == "HTML, CSS& JS") {
      setFront(true)
    }
  }, [language])

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
      setFront(false)
    } else if (lang === "c++") {
      setCode("//write your c++ code here")
      setFront(false)
    } else if (lang === "java") {
      setCode("//write your java code in main class \nclass Main {\npublic static void main(String[] args) {\n\n}\n}")
      setFront(false)
    } else if (lang == "HTML, CSS& JS") {
      setFront(true)
    }
    setLanguage(lang)
    onLanguageChange(lang)
    setDropdown(false)
    if (socketRef.current) {
      socketRef.current.emit(Actions.LANGUAGE_CHANGE, ({ lang, roomId }))
    }
  };

  const showDropDown = () => {
    dropdown ? setDropdown(false) : setDropdown(true)
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

  //  handle front code change
  const handleHtmlChange = myDebounce((html) => {
    setHtmlCode(html)
    if (socketRef.current) {
      socketRef.current.emit(Actions.FRONT_END_CODE_HTML, ({ html, roomId }))
    }
  }, 800)
  const handleCssChange = myDebounce((css) => {
    setCssCode(css)
    if (socketRef.current) {
      socketRef.current.emit(Actions.FRONT_END_CODE_CSS, ({ css, roomId }))
    }
  }, 800)
  const handleJsChange = myDebounce((js) => {
    setJsCode(js)
    if (socketRef.current) {
      socketRef.current.emit(Actions.FRONT_END_CODE_JS, ({ js, roomId }))
    }
  }, 800)




  return (
    <div className='editor'>
      <div className="editorNavbar">
        <div className='loginedUser'>Hello {username}, happy coding 😊.</div>
        <div className="leftbuttons">
          <button className="leftBtns share" onClick={handleShare}>Share</button>
          {front && <button className="leftBtns execute" onClick={handleCodeCompilation}>Download code</button>}
          {!front && <button className="leftBtns execute" onClick={handleCodeCompilation}>Execute</button>}
          <button className='select' onClick={showDropDown}>{language} <ArrowDropDownRoundedIcon /></button>
          {dropdown && <div className="dropdown">
            <button onClick={handleSelectLanguage} className="dropdowns" value="python" >Python</button>
            <button onClick={handleSelectLanguage} className="dropdowns" value="c++">C++</button>
            <button onClick={handleSelectLanguage} className="dropdowns" value="java">Java</button>
            <button onClick={handleSelectLanguage} className="dropdowns" value="HTML, CSS& JS">HTML, CSS& JS</button>
          </div>}

        </div>
      </div>

      {!front &&
        <PanelGroup className="editorBody">
          <Panel>
            <p className='fileName'> <img className='fileIcon' src={fileIconImage} />{language}</p>
            <MonacoEditor
              height="100%"
              width="100%"
              defaultLanguage={language}
              value={code}
              theme='vs-dark'
              onChange={handleChange}
            />
          </Panel>
          <PanelResizeHandle className='handle' />
          <Panel>
            <PanelGroup direction="horizontal">
              <Panel className='inputPanel'>
                <span>Input</span>
                <textarea id="input" placeholder='Enter your inputs here' onChange={handleInputChange} />
              </Panel>
              <PanelResizeHandle className="vHandle" />
              <Panel className='outputPanel'>
                <span>Output</span>
                <div>
                  {output}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>

      }

      {/* front end code */}

      {front &&
        <PanelGroup className="editorBody">
          <Panel>
            <PanelGroup direction="horizontal">
              <Panel minSize={5}>
                <p className='fileName'><img className='fileIcon' src={htmlLogo} alt='htmlLogo' /> HTML</p>
                <MonacoEditor
                  height="100%"
                  width="100%"
                  defaultLanguage="html"
                  theme='vs-dark'
                  onChange={(value) => { handleHtmlChange(value) }}
                  value={htmlCode}
                />
              </Panel>
              <PanelResizeHandle className="vHandle" />
              <Panel minSize={5}>
                <p className='fileName'><img className='fileIcon' src={cssLogo} alt='cssLogo' /> CSS</p>
                <MonacoEditor
                  height="100%"
                  width="100%"
                  defaultLanguage="css"
                  theme='vs-dark'
                  onChange={(value) => { handleCssChange(value) }}
                  value={cssCode}
                />
              </Panel>
              <PanelResizeHandle className="vHandle" />
              <Panel minSize={5}>
                <p className='fileName'> <img className='fileIcon' src={jsLogo} alt='jsLogo' /> JavaScript</p>
                <MonacoEditor
                  height="100%"
                  width="100%"
                  defaultLanguage="javascript"
                  theme='vs-dark'
                  onChange={(value) => { handleJsChange(value) }}
                  value={jsCode}
                />
              </Panel>
            </PanelGroup>
          </Panel>
          <PanelResizeHandle className="handle" />
          <Panel style={{ margin: 0, background: "white" }}>
            <iframe
              srcDoc={`
              <!doctype html>
              <html lang="en">
                <head>
                  <style>${cssCode}</style>
                </head>
                <body>
                  ${htmlCode}
                  <script>${jsCode}</script>
                </body>
              </html>
              `}
              title="output"
              sandbox="allow-scripts"
              frameBorder="0"
              width="100%"
              height="100%"
            />
          </Panel>
        </PanelGroup>
      }

    </div>
  )
}

export default Editor
