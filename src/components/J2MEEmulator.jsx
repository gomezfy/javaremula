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
      console.log('[J2MEEmulator] Boot called, isBooted:', isBootedRef.current, 'hasBuffer:', !!arrayBuffer)
      if (isBootedRef.current || !arrayBuffer) {
        console.log('[J2MEEmulator] Skipping boot - already booted or no buffer')
        return
      }

      try {
        console.log('[J2MEEmulator] Ensuring js2me runtime is ready...')
        await ensureJs2meReady()
        runtimeReadyRef.current = true
        console.log('[J2MEEmulator] Runtime ready, window.js2me:', !!window.js2me)
        
        if (window.js2me && window.js2me.loadJAR) {
          console.log('[J2MEEmulator] Booting JAR:', gameName, 'Buffer size:', arrayBuffer.byteLength)
          window.js2me.storageName = `js2me_${gameName}`
          await window.js2me.loadJAR(arrayBuffer)
          isBootedRef.current = true
          console.log('[J2MEEmulator] JAR boot successful')
        } else {
          console.error('[J2MEEmulator] window.js2me.loadJAR not available')
        }
      } catch (error) {
        console.error('[J2MEEmulator] Boot failed:', error)
        throw error
      }
    },
    teardown: () => {
      console.log('[J2MEEmulator] Teardown called')
      if (window.js2me && window.js2me.stop) {
        window.js2me.stop()
      }
      isBootedRef.current = false
    }
  }))

  useEffect(() => {
    const bootWithJarData = async () => {
      if (jarData && !isBootedRef.current) {
        try {
          await ensureJs2meReady()
          runtimeReadyRef.current = true
          console.log('[J2MEEmulator] Runtime ready, window.js2me:', !!window.js2me)
          
          if (window.js2me && window.js2me.loadJAR) {
            console.log('[J2MEEmulator] Booting JAR from prop:', gameName, 'Buffer size:', jarData.byteLength)
            window.js2me.storageName = `js2me_${gameName}`
            await window.js2me.loadJAR(jarData)
            isBootedRef.current = true
            console.log('[J2MEEmulator] JAR boot successful from prop')
          } else {
            console.error('[J2MEEmulator] window.js2me.loadJAR not available')
          }
        } catch (error) {
          console.error('[J2MEEmulator] Boot from prop failed:', error)
        }
      }
    }
    
    bootWithJarData()
    
    return () => {
      if (window.js2me && window.js2me.stop) {
        window.js2me.stop()
      }
      isBootedRef.current = false
    }
  }, [jarData, gameName])

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
