import { useState, useEffect } from 'react'
import Phone from './components/Phone'
import './App.css'

function App() {
  const [currentGame, setCurrentGame] = useState('snake')
  const [gameList] = useState([
    { id: 'snake', name: 'Snake Classic', size: '64KB' },
    { id: 'demo', name: 'Demo Game', size: '32KB' }
  ])

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
              <button
                key={game.id}
                className={`game-item ${currentGame === game.id ? 'active' : ''}`}
                onClick={() => setCurrentGame(game.id)}
              >
                <div className="game-name">{game.name}</div>
                <div className="game-size">{game.size}</div>
              </button>
            ))}
          </div>

          <div className="upload-section">
            <h3>🚧 Em Desenvolvimento</h3>
            <p style={{fontSize: '0.85rem', color: '#666', marginTop: '10px'}}>
              Upload de arquivos JAR será adicionado em breve.
            </p>
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
