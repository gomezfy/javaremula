let js2meReadyPromise = null;

const JS2ME_SCRIPTS = [
  '/vendor/js2me/zip/zip.js',
  '/vendor/js2me/zip/inflate.js',
  '/vendor/js2me/zip/zip-ext.js',
  '/vendor/js2me/js2me.js',
  '/vendor/js2me/bufferStream.js',
  '/vendor/js2me/convert.js',
  '/vendor/js2me/classes.js',
  '/vendor/js2me/emulator.js',
  '/vendor/js2me/execute.js',
  '/vendor/js2me/events.js',
  '/vendor/js2me/manifest.js',
  '/vendor/js2me/methodStub.js',
  '/vendor/js2me/launcher.js',
  '/vendor/js2me/loader.js',
  '/vendor/js2me/numbers.js',
  '/vendor/js2me/resources.js',
  '/vendor/js2me/threads.js',
  '/vendor/js2me/workers.js',
  '/vendor/js2me/utils.js'
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

export async function ensureJs2meReady() {
  if (js2meReadyPromise) {
    return js2meReadyPromise;
  }

  js2meReadyPromise = (async () => {
    try {
      console.log('[js2me] Loading runtime...');
      
      for (const scriptSrc of JS2ME_SCRIPTS) {
        await loadScript(scriptSrc);
      }
      
      console.log('[js2me] Runtime scripts loaded successfully');
      return true;
    } catch (error) {
      console.error('[js2me] Failed to load runtime:', error);
      js2meReadyPromise = null;
      throw error;
    }
  })();

  return js2meReadyPromise;
}

export function isJs2meReady() {
  return js2meReadyPromise !== null && window.js2me;
}
