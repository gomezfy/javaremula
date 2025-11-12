import { useState, useEffect, useRef } from 'react'
import Display from './Display'
import Controls from './Controls'
import J2MEEmulator from './J2MEEmulator'
import { JarParser } from '../utils/jarParser'
import './Phone.css'

function Phone({ gameType, gameData }) {
  const engineRef = useRef(null)
  const emulatorRef = useRef(null)
  const [displayData, setDisplayData] = useState(null)
  const [hasSave, setHasSave] = useState(false)
  const [isJarGame, setIsJarGame] = useState(false)
  const [jarLoading, setJarLoading] = useState(false)
  const [currentJarData, setCurrentJarData] = useState(null)
  const [currentGameName, setCurrentGameName] = useState(null)

  useEffect(() => {
    const checkSave = () => {
      const saved = localStorage.getItem('snake_save')
      setHasSave(!!saved)
    }
    checkSave()
  }, [])

  useEffect(() => {
    const loadGame = async () => {
      const isImported = gameType && gameType.startsWith('imported_')
      setIsJarGame(isImported)
      setCurrentJarData(null)
      setCurrentGameName(null)
      
      if (isImported) {
        try {
          const savedGames = JarParser.getSavedGames()
          const game = savedGames.find(g => g.id === gameType)
          
          if (game && game.jarData) {
            console.log('[Phone] Found JAR game:', game.name)
            setCurrentJarData(game.jarData)
            setCurrentGameName(game.name)
          } else {
            console.error('[Phone] JAR game not found')
          }
        } catch (error) {
          console.error('[Phone] Failed to load JAR data:', error)
        }
      } else if (gameType === 'snake') {
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
      if (emulatorRef.current) {
        emulatorRef.current.teardown()
      }
    }
  }, [gameType])
  
  useEffect(() => {
    const bootEmulator = async () => {
      if (isJarGame && currentJarData && emulatorRef.current) {
        setJarLoading(true)
        try {
          console.log('[Phone] Booting JAR:', currentGameName)
          await emulatorRef.current.boot(currentJarData)
          console.log('[Phone] JAR boot complete')
        } catch (error) {
          console.error('[Phone] Failed to boot JAR:', error)
        } finally {
          setJarLoading(false)
        }
      }
    }
    
    bootEmulator()
  }, [isJarGame, currentJarData, currentGameName])

  const handleKeyPress = (key) => {
    if (isJarGame && emulatorRef.current) {
      const keyMap = {
        'UP': 'UP',
        'DOWN': 'DOWN',
        'LEFT': 'LEFT',
        'RIGHT': 'RIGHT',
        'SELECT': 'SELECT',
        'BACK': 'BACK',
        '0': 'NUM0', '1': 'NUM1', '2': 'NUM2', '3': 'NUM3',
        '4': 'NUM4', '5': 'NUM5', '6': 'NUM6', '7': 'NUM7',
        '8': 'NUM8', '9': 'NUM9', '*': 'STAR', '#': 'POUND'
      }
      
      const mappedKey = keyMap[key] || key
      emulatorRef.current.sendKey(mappedKey)
    } else if (engineRef.current) {
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
          
          {isJarGame ? (
            <div className="emulator-display">
              {jarLoading && (
                <div className="loading-overlay">
                  <div className="loading-text">Carregando jogo...</div>
                </div>
              )}
              <J2MEEmulator ref={emulatorRef} gameName={currentGameName || gameType} />
            </div>
          ) : (
            <Display data={displayData} />
          )}
          
          <div className="phone-brand">NOKIA</div>
        </div>
        
        <Controls onKeyPress={handleKeyPress} />
        
        {!isJarGame && (
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
        )}
      </div>
    </div>
  )
}

export default Phone
