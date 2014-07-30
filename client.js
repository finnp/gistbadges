window.onload = function () {
  var dropTarget = document.querySelector("#droparea")

  require("drag-and-drop-files")(dropTarget, function(files) {
    var reader = new FileReader()
    var file = files[0]
    
    if(file.type !== 'image/png') {
      alert('Image has to be a PNG image')
      return
    }
    
    reader.readAsDataURL(file)

    reader.onload = function () {
      var dataURL = reader.result
      document.querySelector('#badgeimage').value = dataURL
      document.querySelector("#droparea img").src = dataURL
    }
  })  
}
