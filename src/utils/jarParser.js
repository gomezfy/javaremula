import JSZip from 'jszip'

export class JarParser {
  static async parseJar(file) {
    try {
      const zip = await JSZip.loadAsync(file)
      
      const manifestFile = zip.file('META-INF/MANIFEST.MF')
      let manifest = {}
      
      if (manifestFile) {
        const manifestText = await manifestFile.async('string')
        manifest = this.parseManifest(manifestText)
      }
      
      const jadFile = zip.file(/\.jad$/i)[0]
      let jadInfo = {}
      
      if (jadFile) {
        const jadText = await jadFile.async('string')
        jadInfo = this.parseJad(jadText)
      }
      
      const midletName = jadInfo['MIDlet-Name'] || manifest['MIDlet-Name'] || file.name.replace('.jar', '')
      const midletVendor = jadInfo['MIDlet-Vendor'] || manifest['MIDlet-Vendor'] || 'Unknown'
      const midletVersion = jadInfo['MIDlet-Version'] || manifest['MIDlet-Version'] || '1.0'
      const midletDescription = jadInfo['MIDlet-Description'] || manifest['MIDlet-Description'] || ''
      
      const iconFile = await this.findIcon(zip)
      let iconDataUrl = null
      if (iconFile) {
        const iconBlob = await iconFile.async('blob')
        iconDataUrl = await this.blobToDataUrl(iconBlob)
      }
      
      const gameData = {
        id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: midletName,
        vendor: midletVendor,
        version: midletVersion,
        description: midletDescription,
        size: `${Math.round(file.size / 1024)}KB`,
        icon: iconDataUrl,
        jarData: await file.arrayBuffer(),
        imported: true,
        importDate: new Date().toISOString()
      }
      
      return gameData
      
    } catch (error) {
      console.error('Erro ao processar JAR:', error)
      throw new Error('Arquivo JAR inválido ou corrompido')
    }
  }
  
  static parseManifest(manifestText) {
    const manifest = {}
    const lines = manifestText.split('\n')
    
    for (let line of lines) {
      line = line.trim()
      if (line && line.includes(':')) {
        const [key, ...valueParts] = line.split(':')
        manifest[key.trim()] = valueParts.join(':').trim()
      }
    }
    
    return manifest
  }
  
  static parseJad(jadText) {
    const jad = {}
    const lines = jadText.split('\n')
    
    for (let line of lines) {
      line = line.trim()
      if (line && line.includes(':')) {
        const [key, ...valueParts] = line.split(':')
        jad[key.trim()] = valueParts.join(':').trim()
      }
    }
    
    return jad
  }
  
  static async findIcon(zip) {
    const possiblePaths = [
      /icon\.png$/i,
      /logo\.png$/i,
      /game\.png$/i,
      /\.png$/i
    ]
    
    for (const pattern of possiblePaths) {
      const files = zip.file(pattern)
      if (files.length > 0) {
        return files[0]
      }
    }
    
    return null
  }
  
  static blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }
  
  static saveGame(gameData) {
    try {
      const games = this.getSavedGames()
      games.push(gameData)
      
      const gamesToSave = games.map(game => ({
        ...game,
        jarData: Array.from(new Uint8Array(game.jarData))
      }))
      
      localStorage.setItem('imported_games', JSON.stringify(gamesToSave))
      return true
    } catch (error) {
      console.error('Erro ao salvar jogo:', error)
      return false
    }
  }
  
  static getSavedGames() {
    try {
      const saved = localStorage.getItem('imported_games')
      if (!saved) return []
      
      const games = JSON.parse(saved)
      return games.map(game => ({
        ...game,
        jarData: new Uint8Array(game.jarData).buffer
      }))
    } catch (error) {
      console.error('Erro ao carregar jogos:', error)
      return []
    }
  }
  
  static deleteGame(gameId) {
    try {
      const games = this.getSavedGames()
      const filtered = games.filter(g => g.id !== gameId)
      
      const toSave = filtered.map(game => ({
        ...game,
        jarData: Array.from(new Uint8Array(game.jarData))
      }))
      
      localStorage.setItem('imported_games', JSON.stringify(toSave))
      return true
    } catch (error) {
      console.error('Erro ao deletar jogo:', error)
      return false
    }
  }
}
