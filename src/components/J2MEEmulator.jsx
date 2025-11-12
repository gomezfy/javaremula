import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { ensureJs2meReady } from '../lib/runtimeLoader'
import './J2MEEmulator.css'

const J2MEEmulator = forwardRef(({ jarData, gameName }, ref) => {
  const containerRef = useRef(null)
  const isBootedRef = useRef(false)
  const runtimeReadyRef = useRef(false)

  useImperativeHandle(ref, () => ({
    sendKey: (keyCode) => {
      if (runtimeReadyRef.current && window.js2me) {
        window.js2me.sendKeyPressEvent(keyCode)
        setTimeout(() => window.js2me.sendKeyReleaseEvent(keyCode), 100)
      }
    },
    boot: async (arrayBuffer) => {
      if (isBootedRef.current || !arrayBuffer) return

      try {
        await ensureJs2meReady()
        runtimeReadyRef.current = true
        
        if (window.js2me && window.js2me.loadJAR) {
          console.log('[J2MEEmulator] Booting JAR:', gameName)
          window.js2me.storageName = `js2me_${gameName}`
          await window.js2me.loadJAR(arrayBuffer)
          isBootedRef.current = true
        }
      } catch (error) {
        console.error('[J2MEEmulator] Boot failed:', error)
      }
    },
    teardown: () => {
      if (window.js2me && window.js2me.stop) {
        window.js2me.stop()
      }
      isBootedRef.current = false
    }
  }))

  useEffect(() => {
    return () => {
      if (ref.current) {
        ref.current.teardown()
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="j2me-emulator-container">
      <div id="frame">
        <div id="screen"></div>
        <div id="alert">
          <div className="message"></div>
        </div>
      </div>
    </div>
  )
})

J2MEEmulator.displayName = 'J2MEEmulator'

export default J2MEEmulator
