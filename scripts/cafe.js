// ----- SETUP
var speechBox = document.getElementById("speechBox");
var speechBounds = document.getElementById("speechImg").getBoundingClientRect();
var leftBase = (speechBounds.left + speechBounds.right) / 2;
var topBase = (speechBounds.top + speechBounds.bottom) / 2;
speechBox.style.left = leftBase - 50 + "px";
speechBox.style.top = topBase - 110 + "px";

var modeText = "";
// modeText += `<font size="6pt">Mode?</font><br>`;
modeText += `<span onclick="chooseMode('#')" style="cursor: pointer;">#</span> `;
modeText += `<span onclick="chooseMode('+')" style="cursor: pointer;">+</span>`;
speechBox.innerHTML = modeText;

// Random number 1-12 inclusive
var countTo;

function chooseMode(mode) {
  // Hide mode label
  document.getElementById("speechLabel").hidden = true;

  // Show number
  if (mode == "+") {
    // Generate number 2-12 for addition
    countTo = Math.floor(Math.random() * 11) + 2;

    // Random number 1 - (countTo - 1) = x, remainder = y
    var x = Math.floor(Math.random() * (countTo - 1)) + 1;
    var y = countTo - x;

    speechBox.innerHTML = `${x} + ${y}`;
  } else {
    // Generate number 1-12 for regular
    countTo = Math.floor(Math.random() * 12) + 1;
    speechBox.innerHTML = countTo;
  }
  console.log(`GOAL: ${countTo}`);
}

// ----- FISH
var playState = true;

// Create fish when treat bag clicked
var snackSpot = document.getElementById("snackSpot");
var treatBag = document.getElementById("treatBag");

var nextID = 0;
function createTreat(e) {
  if (playState) {
    snackSpot.innerHTML += `<img src="./images/snack.png" width="100px" class="movable" id="fish${nextID}" draggable="false" />`;
    var newFish = document.getElementById(`fish${nextID}`);

    var treatDimensions = treatBag.getBoundingClientRect();

    newFish.style.left = treatDimensions.left - 130 + "px";
    newFish.style.top = treatDimensions.top + 130 + "px";
    nextID++;

    fish = document.getElementsByClassName("movable");
    for (snack of fish) snack.onmousedown = dragElement;
  }
}

var activeFish = "";

// Movable fish
function dragElement(e) {
  if (playState) {
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

  // If valid fish equals countTo, WIN
  if (validFish == countTo) {
    console.log("Win");
    // Make fish unmovable
    playState = false;
    // Change cursor to default for treats and bag
    for (fish of document.getElementsByClassName("movable")) {
      fish.style.cursor = "default";
    }
    treatBag.style.cursor = "default";

    // Change speech to heart
    speechBox.innerHTML = "❤";
    // speechBox.style.left = leftBase - 30 + "px";
    // Change image to happy cat
    document.getElementById("cat").src = "./images/cat-happy.png";

    // Trigger confetti
    const emojiConfetti = new JSConfetti();

    emojiConfetti.addConfetti({
      emojis: ["🐟"],
      emojiSize: 40,
      confettiNumber: 10,
    });

    // Open win modal
    openWinModal();
  }
}
