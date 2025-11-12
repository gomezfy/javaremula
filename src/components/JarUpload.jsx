import { useState } from 'react'
import { JarParser } from '../utils/jarParser'
import './JarUpload.css'

function JarUpload({ onGameImported }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.jar')) {
      setError('Por favor, selecione um arquivo .jar válido')
      setTimeout(() => setError(null), 3000)
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const gameData = await JarParser.parseJar(file)
      
      const saved = JarParser.saveGame(gameData)
      
      if (saved) {
        setSuccess(`${gameData.name} importado com sucesso!`)
        setTimeout(() => setSuccess(null), 3000)
        
        if (onGameImported) {
          onGameImported(gameData)
        }
        
        event.target.value = ''
      } else {
        throw new Error('Erro ao salvar jogo')
      }
      
    } catch (err) {
      console.error('Erro no upload:', err)
      setError(err.message || 'Erro ao processar arquivo JAR')
      setTimeout(() => setError(null), 5000)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="jar-upload">
      <label htmlFor="jar-file-input" className={`upload-button ${uploading ? 'uploading' : ''}`}>
        {uploading ? (
          <>
            <span className="upload-icon">⏳</span>
            <span>Processando...</span>
          </>
        ) : (
          <>
            <span className="upload-icon">📁</span>
            <span>Importar JAR</span>
          </>
        )}
      </label>
      
      <input
        id="jar-file-input"
        type="file"
        accept=".jar"
        onChange={handleFileSelect}
        disabled={uploading}
        style={{ display: 'none' }}
      />
      
      {error && (
        <div className="upload-message error">
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div className="upload-message success">
          ✅ {success}
        </div>
      )}
      
      <div className="upload-info">
        <small>Arquivos .jar de jogos J2ME/MIDP</small>
      </div>
    </div>
  )
}

export default JarUpload
