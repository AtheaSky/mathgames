// Amount of image options that exist for each animal (SET MANUALLY)
const variants = {
  cat: 2,
  hamster: 1,
};

// ----- ENVIRONMENT SETUP
var speechBox = document.getElementById("speechBox");
var speechBounds = document.getElementById("speechImg").getBoundingClientRect();
var leftBase = (speechBounds.left + speechBounds.right) / 2;
var topBase = (speechBounds.top + speechBounds.bottom) / 2;
speechBox.style.left = leftBase - 50 + "px";
speechBox.style.top = topBase - 110 + "px";
var petNum, petType, treatType;

// Choose mode & number goal
var modeText = "";
modeText += `<span onclick="chooseMode('#')" class="btn" style="cursor: pointer;">#</span> `;
modeText += `<span onclick="chooseMode('+')" class="btn" style="cursor: pointer;">+</span>`;
speechBox.innerHTML = modeText;

// ----- CUSTOM CURSOR
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", function (e) {
  // Make sure large cursor aligns with real cursor
  var xAdj = -1,
    yAdj = 0;
  if (cursor.style.backgroundImage == 'url("./images/pointer.png")') {
    xAdj = -15;
    yAdj = 0;
  } else if (
    cursor.style.backgroundImage == 'url("./images/grab-open.png")' ||
    cursor.style.backgroundImage == 'url("./images/grab-closed.png")'
  ) {
    xAdj = -20;
    yAdj = -20;
  } else {
    xAdj = -1;
    yAdj = 0;
  }

  // Follow mouse
  cursor.style.left = e.clientX + xAdj + "px";
  cursor.style.top = e.clientY + yAdj + "px";
});

// Buttons pointer toggle
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    cursor.style.backgroundImage = 'url("./images/pointer.png")';
  });
});
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mouseout", () => {
    cursor.style.backgroundImage = 'url("./images/default.png")';
  });
});

// Treat

// ----- GAME SETUP
// Choose pet type
const petModal = document.getElementById("petModal");
petModal.style.display = "block";
function choosePet(petChoice) {
  petType = petChoice;

  // Close modal
  petModal.style.display = "none";

  // Summon random pet of chosen type
  petNum = Math.floor(Math.random() * variants[petType]) + 1; // 1-variants
  const petImgLoc = document.getElementById("pet");
  const petBagLoc = document.getElementById("treatBag");

  petImgLoc.src = `./images/${petType}${petNum}.png`;
  petBagLoc.src = `./images/${petType}_bag.png`;

  // Show speech bubble & contents
  document.getElementById("speechImg").hidden = false;
  document.getElementById("speechBox").hidden = false;
  document.getElementById("speechLabel").hidden = false;
}

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
    const x = Math.floor(Math.random() * (countTo - 1)) + 1;
    const y = countTo - x;

    speechBox.innerHTML = `${x} + ${y}`;
  } else {
    // Generate number 1-12 for regular
    countTo = Math.floor(Math.random() * 12) + 1;
    speechBox.innerHTML = countTo;
  }
  console.log(`GOAL: ${countTo}`);
}

// ----- TREAT
var playState = true;

// Create treat when treat bag clicked
const snackSpot = document.getElementById("snackSpot");
const treatBag = document.getElementById("treatBag");

var nextID = 0;
function createTreat(e) {
  if (playState) {
    snackSpot.innerHTML += `<img src="./images/${petType}_treat.png" width="100px" class="movable" id="treat${nextID}" draggable="false" />`;
    var newTreat = document.getElementById(`treat${nextID}`);

    // Assign cursor
    newTreat.addEventListener("mouseenter", () => {
      cursor.style.backgroundImage = 'url("./images/grab-open.png")';
    });
    newTreat.addEventListener("mouseout", () => {
      cursor.style.backgroundImage = 'url("./images/default.png")';
    });

    const treatDimensions = treatBag.getBoundingClientRect();

    newTreat.style.left = treatDimensions.left - 130 + "px";
    newTreat.style.top = treatDimensions.top + 130 + "px";
    nextID++;

    treat = document.getElementsByClassName("movable");
    for (snack of treat) snack.onmousedown = dragElement;
  }
}

var activeTreat = "";

// Movable treat
function dragElement(e) {
  if (playState) {
    e.preventDefault();
    activeTreat = e.target;

    // Set cursor to grabbing while clicked
    activeTreat.style.cursor = "grabbing";
    cursor.style.backgroundImage = 'url("./images/grab-closed.png")';

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
      activeTreat.style.top = activeTreat.offsetTop - pos2 + "px";
      activeTreat.style.left = activeTreat.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      // console.log("Closedrag");
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;

      // Set cursor back to to grab when released
      activeTreat.style.cursor = "grab";
      cursor.style.backgroundImage = 'url("./images/grab-open.png")';

      // Count treats in bowl
      manageCount();
    }
  }
}

function manageCount() {
  const petBounds = document.getElementById("pet").getBoundingClientRect();
  var validTreat = 0;
  // Pet-top = 250
  // Pet-right = 808
  // Pet-bottom = 579
  // Pet-left = 588

  // Update valid count for each existing movable treat
  // Treat-top is above pet-bottom
  // Treat-right is right of pet-left
  // Treat-bottom is below pet-top
  // Treat-left is left of pet-right
  for (treat of document.getElementsByClassName("movable")) {
    var treatBounds = treat.getBoundingClientRect();
    if (
      treatBounds.top <= petBounds.bottom &&
      treatBounds.right >= petBounds.left &&
      treatBounds.bottom >= petBounds.top &&
      treatBounds.left <= petBounds.right
    ) {
      validTreat++;
    }
  }
  console.log(validTreat);

  // If valid treat equals countTo, WIN
  if (validTreat == countTo) {
    console.log("Win");
    // Make treat unmovable
    playState = false;
    // Change cursor to default for treats and bag
    for (treat of document.getElementsByClassName("movable")) {
      treat.style.cursor = "default";
    }
    treatBag.style.cursor = "default";

    // Change speech to heart
    speechBox.innerHTML = "❤";
    // speechBox.style.left = leftBase - 30 + "px";
    // Change image to happy pet
    document.getElementById("pet").src =
      `./images/${petType}${petNum}_happy.png`;

    // Trigger confetti
    const emojiConfetti = new JSConfetti();

    // Choose emoji for animal
    var emoji;
    if (petType == "cat") {
      emoji = "🐟";
    } else if (petType == "hamster") {
      emoji = "🌻";
    }

    emojiConfetti.addConfetti({
      emojis: [emoji],
      emojiSize: 40,
      confettiNumber: 10,
    });

    // Open win modal
    openWinModal();
  }
}
