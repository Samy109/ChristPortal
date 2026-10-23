const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('christPortal', {
  // Window controls
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:is-maximized'),
    onMaximizedChange: (callback) => {
      const handler = (_event, isMax) => callback(isMax);
      ipcRenderer.on('window:maximized-change', handler);
      return () => ipcRenderer.removeListener('window:maximized-change', handler);
    }
  },

  // Ollama
  ollama: {
    listModels: (hostUrl) => ipcRenderer.invoke('ollama:list-models', hostUrl),
    chatStream: (params) => ipcRenderer.invoke('ollama:chat-stream', params),
    abort: () => ipcRenderer.invoke('ollama:abort'),
    onChunk: (callback) => {
      const handler = (_event, data) => callback(data);
      ipcRenderer.on('ollama:chunk', handler);
      return () => ipcRenderer.removeListener('ollama:chunk', handler);
    },
    onDone: (callback) => {
      const handler = (_event, stats) => callback(stats);
      ipcRenderer.on('ollama:done', handler);
      return () => ipcRenderer.removeListener('ollama:done', handler);
    },
    onError: (callback) => {
      const handler = (_event, err) => callback(err);
      ipcRenderer.on('ollama:error', handler);
      return () => ipcRenderer.removeListener('ollama:error', handler);
    }
  },

  // Storage
  storage: {
    get: (key) => ipcRenderer.invoke('storage:get', key),
    set: (key, val) => ipcRenderer.invoke('storage:set', key, val),
    delete: (key) => ipcRenderer.invoke('storage:delete', key)
  },

  // Dialogs
  dialog: {
    exportMarkdown: (params) => ipcRenderer.invoke('dialog:export-markdown', params)
  },

  // Natural Neural Text-to-Speech
  tts: {
    synthesize: (params) => ipcRenderer.invoke('tts:synthesize', params)
  }
});
