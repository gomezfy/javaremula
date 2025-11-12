import { useState, useEffect } from 'react'
import Phone from './components/Phone'
import JarUpload from './components/JarUpload'
import { JarParser } from './utils/jarParser'
import './App.css'

function App() {
  const [activeGames, setActiveGames] = useState(['snake'])
  const [builtInGames] = useState([
    { id: 'snake', name: 'Snake Classic', size: '64KB', builtin: true },
    { id: 'demo', name: 'Demo Game', size: '32KB', builtin: true }
  ])
  const [importedGames, setImportedGames] = useState([])
  
  const gameList = [...builtInGames, ...importedGames]
  
  const loadImportedGames = () => {
    const games = JarParser.getSavedGames()
    setImportedGames(games)
  }
  
  const handleGameImported = (gameData) => {
    loadImportedGames()
    if (!activeGames.includes(gameData.id)) {
      setActiveGames([...activeGames, gameData.id])
    }
  }
  
  const handleDeleteGame = (gameId) => {
    if (confirm('Tem certeza que deseja remover este jogo?')) {
      JarParser.deleteGame(gameId)
      loadImportedGames()
      setActiveGames(activeGames.filter(id => id !== gameId))
    }
  }
  
  const toggleGame = (gameId) => {
    if (activeGames.includes(gameId)) {
      if (activeGames.length > 1) {
        setActiveGames(activeGames.filter(id => id !== gameId))
      }
    } else {
      setActiveGames([...activeGames, gameId])
    }
  }
  
  const isGameActive = (gameId) => activeGames.includes(gameId)
  
  useEffect(() => {
    loadImportedGames()
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>📱 Emulador J2ME</h1>
        <p>Reviva os clássicos jogos Java de celulares antigos</p>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <h2>Jogos Disponíveis</h2>
          <div className="game-list">
            {gameList.map(game => (
              <div key={game.id} className="game-item-wrapper">
                <button
                  className={`game-item ${isGameActive(game.id) ? 'active' : ''}`}
                  onClick={() => toggleGame(game.id)}
                >
                  {game.icon && (
                    <img src={game.icon} alt={game.name} className="game-icon" />
                  )}
                  <div className="game-info">
                    <div className="game-name">{game.name}</div>
                    <div className="game-size">{game.size}</div>
                    {game.vendor && (
                      <div className="game-vendor">{game.vendor}</div>
                    )}
                  </div>
                  {isGameActive(game.id) && <span className="active-indicator">▶</span>}
                </button>
                {game.imported && (
                  <button
                    className="delete-game-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteGame(game.id)
                    }}
                    title="Remover jogo"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="upload-section">
            <h3>📤 Importar Jogo</h3>
            <JarUpload onGameImported={handleGameImported} />
          </div>

          <div className="info-section">
            <h3>ℹ️ Como Usar</h3>
            <ul>
              <li><strong>Clique nos jogos</strong> para abrir/fechar emuladores</li>
              <li><strong>Múltiplos jogos:</strong> Abra vários ao mesmo tempo!</li>
              <li><strong>Setas:</strong> Controlar o jogo</li>
              <li><strong>OK:</strong> Selecionar/Reiniciar</li>
              <li><strong>ESC (↩):</strong> Pausar/Voltar</li>
            </ul>
          </div>
        </aside>

        <main className="emulator-area">
          <div className="emulators-grid">
            {activeGames.map(gameId => (
              <div key={gameId} className="emulator-wrapper">
                <div className="emulator-header">
                  <span className="emulator-title">
                    {gameList.find(g => g.id === gameId)?.name || gameId}
                  </span>
                  {activeGames.length > 1 && (
                    <button
                      className="close-emulator-btn"
                      onClick={() => toggleGame(gameId)}
                      title="Fechar emulador"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <Phone gameType={gameId} />
              </div>
            ))}
          </div>
        </main>
      </div>

      <footer className="footer">
        <p>Emulador J2ME - Nostalgia dos celulares antigos 🎮</p>
      </footer>
    </div>
  )
}

export default App
