// ----- SETUP
var speechBox = document.getElementById("speechBox");
var speechBounds = document.getElementById("speechImg").getBoundingClientRect();
var leftBase = (speechBounds.left + speechBounds.right) / 2;
var topBase = (speechBounds.top + speechBounds.bottom) / 2;
speechBox.style.left = leftBase - 50 + "px";
speechBox.style.top = topBase - 75 + "px";

var modeText = `<font size="6pt">Mode?</font><br>`;
modeText += `<span onclick="chooseMode('#')" style="cursor: pointer;">#</span> `;
modeText += `<span onclick="chooseMode('+')" style="cursor: pointer;">+</span>`;
speechBox.innerHTML = modeText;

// Random number 1-12 inclusive
const countTo = Math.floor(Math.random() * 12) + 1;
console.log(countTo);

function chooseMode(mode) {
  if (mode == "+") {
    // Random number 1-countTo = x, remainder = y
    var x = Math.floor(Math.random() * countTo) + 1;
    var y = countTo - x;

    speechBox.innerHTML = `${x} + ${y}`;

    // Fix location
    if (x > 9 || y > 9) {
      speechBox.style.left = leftBase - 80 + "px";
    } else {
      speechBox.style.left = leftBase - 72 + "px";
    }
    speechBox.style.top = topBase - 20 + "px";
  } else {
    speechBox.innerHTML = countTo;

    // Fix location
    if (countTo > 9) {
      speechBox.style.left = leftBase - 35 + "px";
    } else {
      speechBox.style.left = leftBase - 20 + "px";
    }
    speechBox.style.top = topBase - 20 + "px";
  }
}

// ----- FISH
// Create fish when treat bag clicked
var snackSpot = document.getElementById("snackSpot");
var treatBag = document.getElementById("treatBag");

var nextID = 0;
function createTreat(e) {
  snackSpot.innerHTML += `<img src="./images/snack.png" width="100px" class="movable" id="fish${nextID}" draggable="false" />`;
  var newFish = document.getElementById(`fish${nextID}`);

  var treatDimensions = treatBag.getBoundingClientRect();

  newFish.style.left = treatDimensions.left - 120 + "px";
  newFish.style.top = treatDimensions.top + 240 + "px";
  nextID++;

  fish = document.getElementsByClassName("movable");
  for (snack of fish) snack.onmousedown = dragElement;
}

var activeFish = "";

// Movable fish
function dragElement(e) {
  e.preventDefault();
  activeFish = e.target;

  // Set cursor to grabbing while clicked
  activeFish.style.cursor = "grabbing";

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
    activeFish.style.top = activeFish.offsetTop - pos2 + "px";
    activeFish.style.left = activeFish.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // console.log("Closedrag");
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;

    // Set cursor back to to grab when released
    activeFish.style.cursor = "grab";

    // Count fish in bowl
    manageCount();
  }
}

function manageCount() {
  var catBounds = document.getElementById("cat").getBoundingClientRect();
  var validFish = 0;
  // Cat-top = 250
  // Cat-right = 808
  // Cat-bottom = 579
  // Cat-left = 588

  // Update valid count for each existing movable fish
  // Fish-top is above cat-bottom
  // Fish-right is right of cat-left
  // Fish-bottom is below cat-top
  // Fish-left is left of cat-right
  for (fish of document.getElementsByClassName("movable")) {
    var fishBounds = fish.getBoundingClientRect();
    if (
      fishBounds.top <= catBounds.bottom &&
      fishBounds.right >= catBounds.left &&
      fishBounds.bottom >= catBounds.top &&
      fishBounds.left <= catBounds.right
    ) {
      validFish++;
    }
  }
  console.log(validFish);
}
