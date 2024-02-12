import { useState, useEffect } from 'react'
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Signin from './components/Signin';
import Login from './components/Login';
import Home from './components/Home';
import JoinRoom from './components/JoinRoom';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (<Home />)
    },
    {
      path: "/:roomId",
      element: (<JoinRoom />)
    }, {
      path: "/login",
      element: (<Login />)
    }, {
      path: "/signin",
      element: (<Signin />)
    }
  ])

  return (<RouterProvider router={router} />)
}

export default App
