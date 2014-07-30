window.onload = function () {
  var dropTarget = document.querySelector("#droparea")
  if(!dropTarget) return
  require('drop-file-dataurl')(dropTarget,
    function (dataURL) {
      this.querySelector('input').value = dataURL
      this.querySelector('img').src = dataURL
    },
    function (file) {
      if(file.type === 'image/png') return true
      alert('Badge has to be a PNG image')
    }
  )
}