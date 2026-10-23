const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

// Enable audio and speech autoplay without requiring user gesture restrictions
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

let mainWindow = null;
let activeOllamaRequest = null;
let msEdgeTTSClient = null;

// User data persistence directory
const userDataDir = path.join(app.getPath('userData'), 'ChristPortalData');
if (!fs.existsSync(userDataDir)) {
  fs.mkdirSync(userDataDir, { recursive: true });
}

const storeFilePath = path.join(userDataDir, 'portal_store.json');

function loadStore() {
  try {
    if (fs.existsSync(storeFilePath)) {
      const data = fs.readFileSync(storeFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading store:', err);
  }
  return {};
}

function saveStore(data) {
  try {
    fs.writeFileSync(storeFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving store:', err);
    return false;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 920,
    minWidth: 1080,
    minHeight: 720,
    frame: false, // Custom sacred frameless titlebar
    backgroundColor: '#07090e',
    show: false,
    icon: path.join(__dirname, 'assets', 'icon.jpg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window:maximized-change', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window:maximized-change', false);
  });

  // Open external links in user's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Window controls IPC
ipcMain.handle('window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window:close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window:is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// Storage IPC
ipcMain.handle('storage:get', (event, key) => {
  const store = loadStore();
  return key ? store[key] : store;
});

ipcMain.handle('storage:set', (event, key, val) => {
  const store = loadStore();
  store[key] = val;
  return saveStore(store);
});

ipcMain.handle('storage:delete', (event, key) => {
  const store = loadStore();
  delete store[key];
  return saveStore(store);
});

// Ollama API Integration
ipcMain.handle('ollama:list-models', async (event, hostUrl = 'http://127.0.0.1:11434') => {
  try {
    const url = new URL('/api/tags', hostUrl);
    const response = await fetch(url.toString(), { method: 'GET' });
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, models: data.models || [] };
  } catch (err) {
    return { success: false, error: err.message, models: [] };
  }
});

// Ollama Chat Streaming via IPC
ipcMain.handle('ollama:chat-stream', async (event, { hostUrl = 'http://127.0.0.1:11434', model, messages, options = {} }) => {
  return new Promise((resolve, reject) => {
    try {
      if (activeOllamaRequest) {
        try { activeOllamaRequest.destroy(); } catch (_) {}
        activeOllamaRequest = null;
      }

      const targetUrl = new URL('/api/chat', hostUrl);
      const postData = JSON.stringify({
        model: model,
        messages: messages,
        stream: true,
        options: options
      });

      const reqOptions = {
        hostname: targetUrl.hostname,
        port: targetUrl.port || 11434,
        path: targetUrl.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(reqOptions, (res) => {
        if (res.statusCode !== 200) {
          resolve({ success: false, error: `Ollama returned HTTP status ${res.statusCode}` });
          return;
        }

        let buffer = '';
        res.on('data', (chunk) => {
          buffer += chunk.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop(); // keep last incomplete chunk

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try {
              const parsed = JSON.parse(trimmed);
              if (parsed.message && parsed.message.content) {
                mainWindow.webContents.send('ollama:chunk', {
                  content: parsed.message.content,
                  done: parsed.done || false
                });
              }
              if (parsed.done) {
                mainWindow.webContents.send('ollama:done', {
                  total_duration: parsed.total_duration,
                  eval_count: parsed.eval_count,
                  eval_duration: parsed.eval_duration
                });
                resolve({ success: true, completed: true });
              }
            } catch (e) {
              // Ignore line parse error on partial chunks
            }
          }
        });

        res.on('end', () => {
          activeOllamaRequest = null;
          mainWindow.webContents.send('ollama:done', { done: true });
          resolve({ success: true });
        });
      });

      req.on('error', (err) => {
        activeOllamaRequest = null;
        mainWindow.webContents.send('ollama:error', { error: err.message });
        resolve({ success: false, error: err.message });
      });

      activeOllamaRequest = req;
      req.write(postData);
      req.end();
    } catch (error) {
      activeOllamaRequest = null;
      resolve({ success: false, error: error.message });
    }
  });
});

ipcMain.handle('ollama:abort', () => {
  if (activeOllamaRequest) {
    try {
      activeOllamaRequest.destroy();
    } catch (e) {}
    activeOllamaRequest = null;
    return { success: true };
  }
  return { success: false, message: 'No active generation' };
});

// Native Export Dialog for Conversations or Prayers
ipcMain.handle('dialog:export-markdown', async (event, { defaultFilename = 'Lord_Prayer_Dialogue.md', content }) => {
  if (!mainWindow) return { success: false };
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Export Sacred Conversation',
    defaultPath: defaultFilename,
    filters: [
      { name: 'Markdown Document', extensions: ['md'] },
      { name: 'Text Document', extensions: ['txt'] }
    ]
  });

  if (canceled || !filePath) {
    return { success: false, canceled: true };
  }

  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Natural Neural Spoken Word Voice (MsEdgeTTS)
ipcMain.handle('tts:synthesize', async (event, { text, voice = 'en-US-RogerNeural', rate = '-8%', pitch = '-4Hz' }) => {
  try {
    const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
    if (!msEdgeTTSClient) {
      msEdgeTTSClient = new MsEdgeTTS();
    }
    await msEdgeTTSClient.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = msEdgeTTSClient.toStream(text, {
      rate: rate || '-8%',
      pitch: pitch || '-4Hz'
    });

    const chunks = [];
    return new Promise((resolve) => {
      audioStream.on('data', chunk => chunks.push(chunk));
      audioStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString('base64');
        resolve({ success: true, audioData: `data:audio/mp3;base64,${base64}` });
      });
      audioStream.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });
    });
  } catch (err) {
    return { success: false, error: err.message };
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
