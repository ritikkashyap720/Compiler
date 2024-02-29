import { useState, useEffect } from 'react'
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Signin from './pages/Signin';
import Login from './pages/Login';
import Home from './pages/Home';
import JoinRoom from './pages/JoinRoom';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (<Home />)
    },
    {
      path: "/editor/:roomId",
      element: (<JoinRoom />)
    }, {
      path: "/login",
      element: (<Login />)
    }, {
      path: "/signin",
      element: (<Signin />)
    }
  ])

  return (
    <>
      <Toaster/>
      <RouterProvider router={router} />
    </>
  )
}

export default App
