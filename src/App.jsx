import { useState, useEffect } from 'react'
import Phone from './components/Phone'
import JarUpload from './components/JarUpload'
import { JarParser } from './utils/jarParser'
import './App.css'

function App() {
  const [currentGame, setCurrentGame] = useState('snake')
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
    setCurrentGame(gameData.id)
  }
  
  const handleDeleteGame = (gameId) => {
    if (confirm('Tem certeza que deseja remover este jogo?')) {
      JarParser.deleteGame(gameId)
      loadImportedGames()
      if (currentGame === gameId) {
        setCurrentGame('snake')
      }
    }
  }
  
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
                  className={`game-item ${currentGame === game.id ? 'active' : ''}`}
                  onClick={() => setCurrentGame(game.id)}
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
                </button>
                {game.imported && (
                  <button
                    className="delete-game-btn"
                    onClick={() => handleDeleteGame(game.id)}
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
              <li><strong>Setas:</strong> Mover cobra</li>
              <li><strong>OK:</strong> Reiniciar após Game Over</li>
              <li><strong>ESC (↩):</strong> Pausar/Despausar</li>
              <li><strong>Números 2,4,6,8:</strong> Controles alternativos</li>
            </ul>
          </div>
        </aside>

        <main className="emulator-area">
          <Phone gameType={currentGame} />
        </main>
      </div>

      <footer className="footer">
        <p>Emulador J2ME - Nostalgia dos celulares antigos 🎮</p>
      </footer>
    </div>
  )
}

export default App
