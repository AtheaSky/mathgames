// -----SIGN SETUP
var signBox = document.getElementById("signBox");
var signBounds = document.getElementById("signImg").getBoundingClientRect();
var leftBase = (signBounds.left + signBounds.right) / 2;
var topBase = (signBounds.top + signBounds.bottom) / 2;
signBox.style.left = leftBase - 50 + "px";
signBox.style.top = topBase - 110 + "px";

var modeText = "";
// modeText += `<font size="6pt">Mode?</font><br>`;
modeText += `<span onclick="chooseMode('#')" style="cursor: pointer;">#</span> `;
modeText += `<span onclick="chooseMode('+')" style="cursor: pointer;">+</span>`;
signBox.innerHTML = modeText;

// Random number 1-12 inclusive
var countTo;

function chooseMode(mode) {
  // Hide mode label
  document.getElementById("signLabel").hidden = true;

  // Show number
  if (mode == "+") {
    // Generate number 2-10 for addition
    countTo = Math.floor(Math.random() * 9) + 2;

    // Random number 1 - (countTo - 1) = x, remainder = y
    var x = Math.floor(Math.random() * (countTo - 1)) + 1;
    var y = countTo - x;

    signBox.innerHTML = `${x} + ${y}`;
  } else {
    // Generate number 1-10 for regular
    countTo = Math.floor(Math.random() * 10) + 1;
    signBox.innerHTML = countTo;
  }
  console.log(`GOAL: ${countTo}`);
}

// ----- Generate apples
var container = document.getElementById("treeArea");
var minWidth = document.body.offsetWidth / 2 + 150;
var rangeWidth = document.body.offsetWidth - 200 - minWidth;

var minHeight = 150;
var rangeHeight = document.body.offsetHeight - 100 - minHeight;

// ----- Create apples with random locations
// Create
for (var i = 0; i < 10; i++) {
  container.innerHTML += `<img src="./images/apple.png" width="45px" class="movable" id="apple${i}" draggable="false" />`;
  var newApple = document.getElementById(`apple${i}`);

  // Position
  var x = Math.round(Math.random() * rangeWidth + minWidth);
  var y = Math.round(Math.random() * rangeHeight + minHeight);

  // ----- Adjust
  // If highter void, raise
  if (y > 380 && y < 480) {
    // console.log(`Raising #${i + 1} to y${y - 100}`);
    y -= 100;
    // If lower void, lower
  } else if (y > 480 && y < 570) {
    // console.log(`Lowering #${i + 1} to y${y + 70}`);
    y += 70;
    if (x < 1233) {
      y += 20;
    }
  }
  // If floating corner, move
  // Top left
  if (y < 250 && x < 1000) {
    console.log(`Moving #${i + 1} from top left`);
    y += 100;
    // Top right
  } else if (y < 230 && x > 1250) {
    console.log(`Moving #${i + 1} from top right`);
    x -= 50;
    y += 20;
  }

  // Place
  newApple.style.left = x + "px";
  newApple.style.top = y + "px";
  console.log(`Placed apple ${i + 1} at x${x} y${y}`);
}

apple = document.getElementsByClassName("movable");
for (snack of apple) snack.onmousedown = dragElement;

var activeApple = "";

// Movable apple
function dragElement(e) {
  e.preventDefault();
  activeApple = e.target;

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
