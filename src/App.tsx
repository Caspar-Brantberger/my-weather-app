import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  function Welcome({name}: {name: string}) {
    return <h1>Hello, {name}</h1>;
  }

  return (
    <>
    <h1>Welcome</h1>
    <Welcome name="Sara" />
    </>
  )
}

export default App
