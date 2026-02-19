// Generate apple
var container = document.getElementById("snackSpot");
// (max - min)
var minWidth = document.body.offsetWidth / 2 + 80;
var rangeWidth = document.body.offsetWidth - 150 - minWidth;

var minHeight = 150;
var rangeHeight = document.body.offsetHeight - 100 - minHeight;

// Create apples with random locations
for (var i = 0; i < 10; i++) {
  container.innerHTML += `<img src="./images/apple.png" width="45px" class="movable" id="apple${i}" draggable="false" />`;
  var newApple = document.getElementById(`apple${i}`);
  newApple.style.left =
    Math.round(Math.random() * rangeWidth + minWidth) + "px";
  newApple.style.top =
    Math.round(Math.random() * rangeHeight + minHeight) + "px";
}

apple = document.getElementsByClassName("movable");
for (snack of apple) snack.onmousedown = dragElement;

var activeApple = "";

// Movable apple
function dragElement(e) {
  e.preventDefault();
  activeApple = e.target;
  console.log(activeApple);

  // Set cursor to grabbing while clicked
  activeApple.style.cursor = "grabbing";

  // Handling
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  // move the DIV from anywhere inside the DIV:
  // get the mouse cursor position at startup:
  pos3 = e.clientX;
  pos4 = e.clientY;
  document.onmouseup = closeDragElement;
  // call a function whenever the cursor moves:
  document.onmousemove = elementDrag;

  function elementDrag(e) {
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    activeApple.style.top = activeApple.offsetTop - pos2 + "px";
    activeApple.style.left = activeApple.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;

    // Set cursor back to to grab when released
    activeApple.style.cursor = "grab";
  }
}
