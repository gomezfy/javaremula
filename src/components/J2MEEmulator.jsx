import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react'
import { ensureJs2meReady } from '../lib/runtimeLoader'
import './J2MEEmulator.css'

const J2MEEmulator = forwardRef(({ jarData, gameName }, ref) => {
  const containerRef = useRef(null)
  const isBootedRef = useRef(false)
  const runtimeReadyRef = useRef(false)
  const [domReady, setDomReady] = useState(false)

  useEffect(() => {
    if (containerRef.current && !domReady) {
      const template = `
        <div id="frame">
          <div id="screen"></div>
          <div id="alert" style="display: none;">
            <div class="message"></div>
          </div>
        </div>
        <div id="joypad" style="display: none;"></div>
        <div id="keypad" style="display: none;">
          <button id="up"></button>
          <button id="down"></button>
          <button id="left"></button>
          <button id="right"></button>
          <button id="ok"></button>
          <button id="choice"></button>
          <button id="back"></button>
          <button id="num0"></button>
          <button id="num1"></button>
          <button id="num2"></button>
          <button id="num3"></button>
          <button id="num4"></button>
          <button id="num5"></button>
          <button id="num6"></button>
          <button id="num7"></button>
          <button id="num8"></button>
          <button id="num9"></button>
        </div>
        <div id="settings" style="display: none;">
          <select class="screen-size">
            <option value="240,320,0">240x320</option>
          </select>
          <button class="generate-methods">Generate</button>
          <button class="done">Done</button>
        </div>
        <button id="settings-button" style="display: none;">Settings</button>
        <button id="open-joypad" style="display: none;">Joypad</button>
        <div id="top" style="display: none;"></div>
        <div class="topbutton" id="show" style="display: none;">Show</div>
        <div class="topbutton" id="hide" style="display: none;">Hide</div>
      `
      containerRef.current.innerHTML = template
      setDomReady(true)
    }
  }, [domReady])

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
      if (jarData && !isBootedRef.current && domReady) {
        try {
          console.log('[J2MEEmulator] DOM ready, loading runtime...')
          await ensureJs2meReady()
          
          window.dispatchEvent(new Event('load'))
          
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
  }, [jarData, gameName, domReady])

  return (
    <div ref={containerRef} className="j2me-emulator-container" />
  )
})

J2MEEmulator.displayName = 'J2MEEmulator'

export default J2MEEmulator
