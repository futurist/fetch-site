function addCss (fileName) {
  var head = document.head
  var link = document.createElement('link')

  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = fileName

  head.appendChild(link)
}

window.onload = e=> setTimeout(()=>{
  addCss('css/a.css')
  document.getElementById('h1').style.background = 'url(images/中文.gif)'
}, 100)


