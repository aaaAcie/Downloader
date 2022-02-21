const { ipcRenderer } = require('electron')
const { exec,spawn } = require('child_process')
// const { exec } = require('./util.js')

window.onload = () => {
  const url = document.getElementById('url')
  const path = document.getElementById('path')
  const fileName = document.getElementById('file-name')
  const submitBtn = document.getElementById('submit')
  const img = document.getElementById('img')
  img.onclick = () => {
    console.log('感谢 zpp 赞助的 vc（๑ `▽´๑)')
  }
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
  // 消息通知处理
  const cover = document.getElementsByClassName('cover')[0]
  const final = document.getElementById('final')
  const progress = document.getElementById('progress')
  progress.innerText = '本项目原型为：https://github.com/soimort/you-get'
  const success = document.getElementById('success')
  final.innerHTML = '等待选择下载参数...'
  
  submitBtn.onclick = () => {
    if (!data.url) {
      cover.style.display = 'block'
      final.innerText = '请输入网址'
      url.style.backgroundColor = '#f6d05b'
      url.style.color = '#ffffff'
      url.value = '网址为必填项'
      // url.style.outline = '#fecb42 solid medium'
      final.style.fontWeight = '700'
      final.style.fontSize = '24px'
      setTimeout(() => {
        cover.style.display = 'none'
      },2000)
      setTimeout(() => {
        url.value = ''
        url.style.backgroundColor = '#fff'
        url.style.color = '#5f5f5f'
      },3500)
      return 
    }
    cover.style.display = 'block'
    success.innerText = ''
    final.innerHTML = '下载准备中，请稍等...<br>'
    let command = "you-get -o " + data.path + ' -O ' + data.name + ' ' + data.url
    console.log(command)
    exec2(command,progress,final,success,cover)
  }
}
function exec2 (cmd,progress,final,success,cover) {
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
    cover.style.display = 'none'
  })

  process.on('exit', (code) => {
    let num = code.toString()
    console.log('child process exited with code ' + num)
    if ( num == '0'){
      success.innerText = '下载成功'
      cover.style.display = 'none'
    }
  })
}