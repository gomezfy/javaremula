import { useRef, useEffect } from 'react'
import './Display.css'

function Display({ data }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = data.backgroundColor || '#9DB892'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (data.pixels) {
      data.pixels.forEach(pixel => {
        ctx.fillStyle = pixel.color
        ctx.fillRect(pixel.x, pixel.y, pixel.width || 1, pixel.height || 1)
      })
    }

    if (data.text) {
      ctx.fillStyle = data.textColor || '#000000'
      ctx.font = data.font || '12px monospace'
      ctx.fillText(data.text, data.textX || 10, data.textY || 20)
    }
  }, [data])

  return (
    <div className="display">
      <canvas
        ref={canvasRef}
        width={176}
        height={208}
        className="display-canvas"
      />
      <div className="display-overlay"></div>
    </div>
  )
}

export default Display
