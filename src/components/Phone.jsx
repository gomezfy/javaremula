import { useState, useEffect, useRef } from 'react'
import Display from './Display'
import Controls from './Controls'
import './Phone.css'

function Phone({ gameType }) {
  const engineRef = useRef(null)
  const [displayData, setDisplayData] = useState(null)
  const [hasSave, setHasSave] = useState(false)

  useEffect(() => {
    const checkSave = () => {
      const saved = localStorage.getItem('snake_save')
      setHasSave(!!saved)
    }
    checkSave()
  }, [])

  useEffect(() => {
    const loadGame = async () => {
      if (gameType === 'snake') {
        const { SnakeGame } = await import('../games/Snake')
        const gameEngine = new SnakeGame()
        engineRef.current = gameEngine
        
        gameEngine.onUpdate = (data) => {
          setDisplayData(data)
        }
        
        gameEngine.start()
      }
    }

    loadGame()

    return () => {
      if (engineRef.current) {
        engineRef.current.stop()
        engineRef.current = null
      }
    }
  }, [gameType])

  const handleKeyPress = (key) => {
    if (engineRef.current) {
      engineRef.current.handleInput(key)
    }
  }

  const handleSave = () => {
    if (engineRef.current && engineRef.current.saveState) {
      engineRef.current.saveState()
      setHasSave(true)
      alert('Jogo salvo com sucesso!')
    }
  }

  const handleLoad = () => {
    if (engineRef.current && engineRef.current.loadState) {
      engineRef.current.loadState()
      alert('Jogo carregado!')
    }
  }

  return (
    <div className="phone">
      <div className="phone-body">
        <div className="phone-screen-area">
          <div className="phone-speaker"></div>
          <Display data={displayData} />
          <div className="phone-brand">NOKIA</div>
        </div>
        
        <Controls onKeyPress={handleKeyPress} />
        
        <div className="save-controls">
          <button onClick={handleSave} className="save-btn">
            💾 Salvar
          </button>
          <button 
            onClick={handleLoad} 
            className="save-btn"
            disabled={!hasSave}
          >
            📂 Carregar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Phone
