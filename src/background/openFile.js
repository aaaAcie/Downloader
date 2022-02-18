const { dialog, ipcMain, BrowserWindow } =  require('electron')
const { exec } = require('child_process')
// 异步并回复
ipcMain.handle("openFile", async (e,args) => {
  console.log('here are the news from ipcMain')
  const msg = await dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow.webContent, {
    properties: ['openDirectory']
  })
  console.log('here is the return msg ' + msg)

  return msg || '请在上方按钮处选择文件目录'

})

// 同步
ipcMain.on("start", (e,command) => {
  let msg = ''
  console.log('Start downloading\n' + command)
  exec(command, function(error,stdout,stderr){
    if(error) {
      msg = stderr
      console.info('stderr : ' + stderr)
    } else {
      msg = stdout
      console.log('success\n' + stdout)
    }
  })
  const result = dialog.showMessageBox(BrowserWindow.getFocusedWindow.webContent, {
    message: '正在下载中... 请稍等\n' + msg,
    type: 'info'
  })
  console.log('here is the result ' + result)

  e.sender.send('replay',msg)

})
