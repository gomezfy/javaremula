import { useEffect } from 'react'
import './Controls.css'

function Controls({ onKeyPress }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyMap = {
        'ArrowUp': 'UP',
        'ArrowDown': 'DOWN',
        'ArrowLeft': 'LEFT',
        'ArrowRight': 'RIGHT',
        'Enter': 'SELECT',
        'Escape': 'BACK',
        '1': '1', '2': '2', '3': '3',
        '4': '4', '5': '5', '6': '6',
        '7': '7', '8': '8', '9': '9',
        '*': '*', '0': '0', '#': '#'
      }

      if (keyMap[e.key]) {
        e.preventDefault()
        onKeyPress(keyMap[e.key])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onKeyPress])

  const handleButtonClick = (key) => {
    onKeyPress(key)
  }

  return (
    <div className="controls">
      <div className="dpad">
        <button className="dpad-btn dpad-up" onClick={() => handleButtonClick('UP')}>▲</button>
        <button className="dpad-btn dpad-left" onClick={() => handleButtonClick('LEFT')}>◀</button>
        <button className="dpad-btn dpad-center" onClick={() => handleButtonClick('SELECT')}>OK</button>
        <button className="dpad-btn dpad-right" onClick={() => handleButtonClick('RIGHT')}>▶</button>
        <button className="dpad-btn dpad-down" onClick={() => handleButtonClick('DOWN')}>▼</button>
      </div>

      <div className="action-buttons">
        <button className="action-btn" onClick={() => handleButtonClick('BACK')}>
          <span>↩</span>
        </button>
        <button className="action-btn" onClick={() => handleButtonClick('SELECT')}>
          <span>✓</span>
        </button>
      </div>

      <div className="numpad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
          <button
            key={key}
            className="numpad-btn"
            onClick={() => handleButtonClick(key)}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Controls
