import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import AnimationState from './components/Context/AnimationState'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AnimationState>
      <App />
    </AnimationState>
  </React.StrictMode>,
)
