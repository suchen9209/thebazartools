import { contextBridge, ipcRenderer } from 'electron'

// 暴露给渲染进程的 API
contextBridge.exposeInMainWorld('electronAPI', {
  // 悬浮窗控制
  toggleOverlay: () => ipcRenderer.invoke('toggle-overlay'),
  updateOverlayData: (data: any) => ipcRenderer.invoke('update-overlay-data', data),
  
  // 监听悬浮窗数据更新
  onOverlayData: (callback: (data: any) => void) => {
    ipcRenderer.on('overlay-data', (_, data) => callback(data))
  }
})
