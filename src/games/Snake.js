export class SnakeGame {
  constructor() {
    this.width = 176
    this.height = 208
    this.gridSize = 8
    this.cols = Math.floor(this.width / this.gridSize)
    this.rows = Math.floor(this.height / this.gridSize)
    
    this.snake = [{ x: 10, y: 10 }]
    this.direction = { x: 1, y: 0 }
    this.nextDirection = { x: 1, y: 0 }
    this.food = this.generateFood()
    this.score = 0
    this.gameOver = false
    this.paused = false
    
    this.gameLoop = null
    this.speed = 150
    this.onUpdate = null
  }

  generateFood() {
    let food
    let valid = false
    
    while (!valid) {
      food = {
        x: Math.floor(Math.random() * this.cols),
        y: Math.floor(Math.random() * this.rows)
      }
      
      valid = !this.snake.some(segment => 
        segment.x === food.x && segment.y === food.y
      )
    }
    
    return food
  }

  start() {
    this.gameLoop = setInterval(() => {
      if (!this.paused && !this.gameOver) {
        this.update()
        this.render()
      }
    }, this.speed)
  }

  stop() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop)
      this.gameLoop = null
    }
  }

  update() {
    this.direction = { ...this.nextDirection }
    
    const head = {
      x: this.snake[0].x + this.direction.x,
      y: this.snake[0].y + this.direction.y
    }

    if (head.x < 0) head.x = this.cols - 1
    if (head.x >= this.cols) head.x = 0
    if (head.y < 0) head.y = this.rows - 1
    if (head.y >= this.rows) head.y = 0

    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.gameOver = true
      return
    }

    this.snake.unshift(head)

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10
      this.food = this.generateFood()
    } else {
      this.snake.pop()
    }
  }

  render() {
    const pixels = []

    for (let segment of this.snake) {
      pixels.push({
        x: segment.x * this.gridSize,
        y: segment.y * this.gridSize,
        width: this.gridSize - 1,
        height: this.gridSize - 1,
        color: '#2c3e50'
      })
    }

    pixels.push({
      x: this.food.x * this.gridSize,
      y: this.food.y * this.gridSize,
      width: this.gridSize - 1,
      height: this.gridSize - 1,
      color: '#e74c3c'
    })

    const displayData = {
      backgroundColor: '#9DB892',
      pixels: pixels,
      text: this.gameOver ? 'GAME OVER!' : `Score: ${this.score}`,
      textX: 10,
      textY: 15,
      textColor: '#000000',
      font: 'bold 12px monospace'
    }

    if (this.gameOver) {
      displayData.text = `GAME OVER! Score: ${this.score}`
      displayData.textX = 20
      displayData.textY = this.height / 2
    } else if (this.paused) {
      displayData.text = `PAUSADO - Score: ${this.score}`
    }

    if (this.onUpdate) {
      this.onUpdate(displayData)
    }
  }

  handleInput(key) {
    if (this.gameOver) {
      if (key === 'SELECT') {
        this.reset()
      }
      return
    }

    switch (key) {
      case 'UP':
      case '2':
        if (this.direction.y === 0) {
          this.nextDirection = { x: 0, y: -1 }
        }
        break
      case 'DOWN':
      case '8':
        if (this.direction.y === 0) {
          this.nextDirection = { x: 0, y: 1 }
        }
        break
      case 'LEFT':
      case '4':
        if (this.direction.x === 0) {
          this.nextDirection = { x: -1, y: 0 }
        }
        break
      case 'RIGHT':
      case '6':
        if (this.direction.x === 0) {
          this.nextDirection = { x: 1, y: 0 }
        }
        break
      case 'BACK':
        this.paused = !this.paused
        break
    }
  }

  reset() {
    this.snake = [{ x: 10, y: 10 }]
    this.direction = { x: 1, y: 0 }
    this.nextDirection = { x: 1, y: 0 }
    this.food = this.generateFood()
    this.score = 0
    this.gameOver = false
    this.paused = false
    this.speed = 150
    this.stop()
    this.start()
  }

  saveState() {
    const state = {
      snake: this.snake,
      direction: this.direction,
      food: this.food,
      score: this.score,
      speed: this.speed
    }
    localStorage.setItem('snake_save', JSON.stringify(state))
  }

  loadState() {
    const saved = localStorage.getItem('snake_save')
    if (saved) {
      const state = JSON.parse(saved)
      this.snake = state.snake
      this.direction = state.direction
      this.nextDirection = state.direction
      this.food = state.food
      this.score = state.score
      this.speed = state.speed
      this.gameOver = false
      this.paused = false
      this.stop()
      this.start()
    }
  }
}
