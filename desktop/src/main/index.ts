import { app, BrowserWindow, ipcMain, screen } from 'electron'
import path from 'path'

// 主窗口
let mainWindow: BrowserWindow | null = null
// 悬浮窗
let overlayWindow: BrowserWindow | null = null

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    titleBarStyle: 'hiddenInset',
    show: false
  })

  // 加载 Web 应用
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    // 主窗口关闭时，关闭悬浮窗
    overlayWindow?.close()
  })
}

// 创建悬浮窗
function createOverlayWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  
  overlayWindow = new BrowserWindow({
    width: 300,
    height: 400,
    x: width - 320,
    y: 100,
    alwaysOnTop: true,
    skipTaskbar: true,
    frame: false,
    transparent: true,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true
    }
  })

  // 悬浮窗加载简化版界面
  overlayWindow.loadURL(`data:text/html,
    <html>
      <head>
        <style>
          body { 
            margin: 0; 
            font-family: -apple-system, sans-serif; 
            background: rgba(30, 30, 30, 0.95);
            color: white;
            border-radius: 12px;
            overflow: hidden;
          }
          .header { 
            background: #722ed1; 
            padding: 12px; 
            font-weight: bold;
            cursor: move;
            -webkit-app-region: drag;
          }
          .content { padding: 16px; }
          .stat { 
            display: flex; 
            justify-content: space-between; 
            margin: 8px 0;
            padding: 8px;
            background: rgba(255,255,255,0.1);
            border-radius: 6px;
          }
          .suggestion {
            margin-top: 12px;
            padding: 10px;
            background: rgba(114, 46, 209, 0.3);
            border-radius: 6px;
            font-size: 12px;
          }
          .close-btn {
            position: absolute;
            top: 8px;
            right: 12px;
            cursor: pointer;
            -webkit-app-region: no-drag;
          }
        </style>
      </head>
      <body>
        <div class="header">
          大巴扎助手
          <span class="close-btn" onclick="window.close()">✕</span>
        </div>
        <div class="content">
          <div class="stat">
            <span>当前构筑</span>
            <span>海盗武器流</span>
          </div>
          <div class="stat">
            <span>理论DPS</span>
            <span>125.5</span>
          </div>
          <div class="stat">
            <span>预计击杀时间</span>
            <span>8.2秒</span>
          </div>
          
          <div class="suggestion">
            💡 <strong>建议</strong><br/>
            1. 将鱼叉炮移至左侧<br/>
            2. 可搭配：水手刀、暴击附魔
          </div>
        </div>
      </body>
    </html>
  `)

  overlayWindow.on('closed', () => {
    overlayWindow = null
  })
}

// IPC 通信
ipcMain.handle('toggle-overlay', () => {
  if (overlayWindow) {
    if (overlayWindow.isVisible()) {
      overlayWindow.hide()
    } else {
      overlayWindow.show()
    }
  } else {
    createOverlayWindow()
  }
})

ipcMain.handle('update-overlay-data', (_, data) => {
  if (overlayWindow) {
    overlayWindow.webContents.send('overlay-data', data)
  }
})

app.whenReady().then(() => {
  createMainWindow()
  
  app.on('activate', () => {
    if (mainWindow === null) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
