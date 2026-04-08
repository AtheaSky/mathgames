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

// ----- Canvas
const field = new Image();
field.src = "./images/appletree.png";
field.onload = function () {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = field.width;
  canvas.height = field.height;

  context.drawImage(field, 0, 0);

  // ----- Generate apples
  var container = document.getElementById("treeArea");
  // (max - min)
  var minWidth = document.body.offsetWidth / 2 + 80;
  var rangeWidth = document.body.offsetWidth - 150 - minWidth;

  var minHeight = 150;
  var rangeHeight = document.body.offsetHeight - 100 - minHeight;

  // Allowed colours
  const rMin = 30;
  const rMax = 90;
  const gMin = 100;
  const gMax = 200;
  const bMin = 50;
  const bMax = 130;

  // ----- Create apples with random locations
  // Create
  for (var i = 0; i < 10; i++) {
    container.innerHTML += `<img src="./images/apple.png" width="45px" class="movable" id="apple${i}" draggable="false" />`;
    var newApple = document.getElementById(`apple${i}`);

    var maxAtmp = 20;
    var atmp = 0;
    while (atmp < maxAtmp) {
      atmp += 1;
      // Position
      var x = Math.round(Math.random() * rangeWidth + minWidth);
      var y = Math.round(Math.random() * rangeHeight + minHeight);

      const data = context.getImageData(x, y, 1, 1).data;
      var halfApple = 23;
      var r = data[0] - halfApple;
      var g = data[1] - halfApple;
      var b = data[2] - halfApple;
      console.log(
        `Apple${i + 1} Attempt${atmp}: R${data[0]} G${data[1]} B${data[2]}`,
      );
      if (
        r >= rMin &&
        r <= rMax &&
        g >= gMin &&
        g <= gMax &&
        b >= bMin &&
        b <= bMax
      ) {
        console.log(`RGB success`);
        break;
      }
    }
    if (atmp >= maxAtmp) {
      console.log(`Aborting attempts for apple ${i + 1}`);
    }

    // Place
    newApple.style.left = x + "px";
    newApple.style.top = y + "px";
  }
};

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
