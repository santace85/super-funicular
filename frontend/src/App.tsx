import { useEffect, useState } from 'react'
import Demo from "./pages/Demo";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

useEffect(() => {
  fetch('/api/health')
    .then(r => r.text())
    .then(console.log);
}, []);


  return (

   <Demo />

  )
}

export default App
