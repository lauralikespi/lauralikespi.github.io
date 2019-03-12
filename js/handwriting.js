function handwriting() {
  var x = document.getElementsByClassName("hidden");
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "block";
  }

  var y = document.getElementById("hiddenCircle");
  y.setAttribute("style", "vertical-align: middle; height: 55px; width: 55px; border-radius: 50%; border: 1px solid #ffcccc; margin-left: auto; margin-right: auto; padding: 1px;");
  
}


setTimeout(handwriting, 5000);

function testScreenSize() {
    console.log("width: " + document.documentElement.clientWidth);
}