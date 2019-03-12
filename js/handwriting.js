function handwriting() {
  var x = document.getElementsByClassName("hidden");
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "block";
  }

  var y = document.getElementById("hiddenCircle");
  y.setAttribute("style", "vertical-align: middle; height: 55px; width: 55px; border-radius: 50%; border: 1px solid #ffcccc; margin-left: auto; margin-right: auto; padding: 1px;");
  
}

var mid=document.getElementById('smallWords').style.height;
document.getElementById('rightHandwriting').style.height=mid;
document.getElementById('leftHandwriting').style.height=mid;

setTimeout(handwriting, 5000);

// Function below prints out the current width of the browser window
// function testScreenSize() {
//     console.log("width: " + document.documentElement.clientWidth);
// }