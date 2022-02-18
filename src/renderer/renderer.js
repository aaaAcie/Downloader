const { ipcRenderer } = require('electron')
const { exec,spawn } = require('child_process')
// const { exec } = require('./util.js')

window.onload = () => {
  // "you-get -o D:/SOMETHING/SLASH/front-end/material/crossEnd -O logo2 https://v3.cn.vuejs.org/logo.png"
  console.log('refresh')
  let url = document.getElementById('url')
  let path = document.getElementById('path')
  let fileName = document.getElementById('file-name')
  let submitBtn = document.getElementById('submit')
  var data = {
    url: '',
    path: window.localStorage.getItem('path') || '',
    name: ''
  }
  path.innerText = data.path
  url.onblur = () => {
    data.url = url.value.split('?')[0]
    console.log(data)
  }
  bt = document.querySelector('#bt')
  bt.onclick = () => {
    // 异步
    ipcRenderer.invoke('openFile','now!').then((result)=>{
      data.path = result
      path.innerText = result
      window.localStorage.setItem('path',result)
    })
  }

  fileName.onblur = () => {
    data.name = fileName.value
  }

  let final = document.getElementById('final')
  let progress = document.getElementById('progress')
  progress.innerText = '本项目原型为：https://github.com/soimort/you-get'
  let success = document.getElementById('success')
  final.innerHTML = '等待选择下载参数...'
  submitBtn.onclick = () => {
    success.innerText = ''
    final.innerHTML = '下载准备中，请稍等...<br>'
    let command = "you-get -o " + data.path + ' -O ' + data.name + ' ' + data.url
    console.log(command)
    exec2(command,progress,final,success)
  }
}
function exec2 (cmd,progress,final,success) {
  const process = exec(cmd)
  process.stdout.on('data', (data) => {
    // console.log('stdout: ' + data.toString())
    let str = data.toString()
    console.log('==== ' + str)
    if (str.startsWith('%', 5)) {
      progress.innerHTML = str
    } else {
      if (str.startsWith('Downloading')){
        final.innerText += str.split('...')[0]
      } else {
        final.innerText += str
      }
    }
    success.innerText = '正在下载'
  })

  process.stderr.on('data', (data) => {
    // console.log('stderr: ' + data.toString())
    final.innerHTML = data.toString()
    success.innerText = '下载失败'
  })

  process.on('exit', (code) => {
    let num = code.toString()
    console.log('child process exited with code ' + num)
    if ( num == '0'){
      success.innerText = '下载成功'
    }
  })
}