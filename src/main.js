// 主进程 公共JS模块
const { app, BrowserWindow } = require('electron')
const path = require('path/posix')
// 添加一个 createWindow() 方法来将 index.html 加载进一个新的 BrowserWindow 实例
function createWindow () {
  const win = new BrowserWindow({
    width: 550,
    height: 620,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      // preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile(path.join(__dirname,'index.html'))
  // win.webContents.openDevTools()
  require('./background/openFile')
}
// 接着，调用createWindow()函数来打开您的窗口。
// 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口。 
// 您可以通过使用 app.whenReady() API来监听此事件。 在whenReady()成功后调用createWindow()。
app.whenReady().then(() => {
  createWindow()
})
// To implement this, listen for the app module's 'window-all-closed' event, 
// and call app.quit() if the user is not on macOS (darwin).
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
