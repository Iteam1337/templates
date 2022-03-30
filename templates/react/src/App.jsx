import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h2>Hello Iteam + React!</h2>
        <img src="https://cdn-assets-cloud.frontify.com/local/frontify/eyJwYXRoIjoiXC9wdWJsaWNcL3VwbG9hZFwvc2NyZWVuc1wvMTUzOTg2XC9lZWNmNjExMDg1YTI1YWM0MTIzZGE3NmY4M2EzZTdkNi0xNTEyNzI5Mzk3LnBuZyJ9:frontify:ANleqg1_q50wrm-EmaePRoqAtTkpInN90J70KGuqUbU?width=449" className="App-logo" alt="logo" />
      </header>
    </div>
  )
}

export default App
