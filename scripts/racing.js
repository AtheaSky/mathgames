const spacesPerPlayer = 8;
const playerCol = ["#74aad3", "#d37474"];
const playerColSecondary = ["#d1dee7", "#e0cfcf"];

var questionWidth;
var carBaseX;

var pTurn = 0;
var placements = [-1, -1];

var currentAns;
var currentWheelResult;

// Wheel setup
const overlay = new Image();
overlay.src = "./images/wheel-overlay.png";

const wheelContents = {
  radius: 0.9,
  offset: { x: -0.05, y: -0.05 },
  overlayImage: overlay,
  itemBackgroundColors: ["#ddafaf", "#8faadd", "#c7eead"],
  items: [
    {
      label: "one",
    },
    {
      label: "two",
    },
    {
      label: "three",
    },
  ],
};
const wheelDiv = document.getElementById("wheelModalContent");
const wheel = new spinWheel.Wheel(wheelDiv, wheelContents);
const quesDiv = document.getElementById("quesModalContent");

//-----GAME SETUP
const introModal = document.getElementById("introModal");
introModal.style.display = "block";
function start() {
  // Close modal
  introModal.style.display = "none";

  // Get values from html
  let xMin = +document.getElementById("xMin").value;
  let xMax = +document.getElementById("xMax").value;
  let yMin = +document.getElementById("yMin").value;
  let yMax = +document.getElementById("yMax").value;
  let operator = document.getElementById("operator").value;

  let p1qa = getQA(8, operator, xMin, xMax, yMin, yMax);
  let p2qa = getQA(8, operator, xMin, xMax, yMin, yMax);

  overallValid = !(p1qa[0].length == 0 || p2qa[0].length == 0);
  if (overallValid) {
    questions = [p1qa[0], p2qa[0]];
    answers = [p1qa[1], p2qa[1]];
  } else {
    console.log("Invalid");
    document.getElementById("pageTitle").innerHTML =
      "INVALID INPUT; refresh & try again";
    document.getElementById("pageTitle").style.color = "#8d1818";
  }
  console.log(p1qa);
  console.log(p2qa);

  // Place questions on track
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 8; j++) {
      document.getElementById(`p${i + 1}q${j + 1}`).innerHTML = questions[i][j];
    }
  }
}

let currentQuestion;
var endState = false;

// Place finish line
const finish = document.getElementById("finish");
const trackEnd = document.getElementById("p1q8");
const trackEndLoc = trackEnd.getBoundingClientRect();
const flagLoc = finish.getBoundingClientRect();
finish.style.left = trackEndLoc.left + 135 + "px";
finish.style.top =
  trackEndLoc.top + (flagLoc.bottom - flagLoc.top) / 2 - 20 + "px";

// Place cars
for (var i = 1; i < 3; i++) {
  const car = document.getElementById(`car${i}`);
  const q1 = document.getElementById(`p${i}q1`);
  const q1Loc = q1.getBoundingClientRect();
  questionWidth = q1Loc.right - q1Loc.left;

  carBaseX = q1Loc.left - 160;
  car.style.left = carBaseX + "px";
  car.style.top = q1Loc.top + 16 + "px";
}

// ------ GAME PLAY
// When play button clicked
function turn() {
  // Show wheel
  document.getElementById("wheelModal").style.display = "block";
}

// Show dialog with question
function showQuestion() {
  // Set question
  var destination = placements[pTurn] + currentWheelResult;
  if (destination >= spacesPerPlayer) {
    destination = spacesPerPlayer - 1;
  }
  var question = questions[pTurn][destination];
  currentAns = answers[pTurn][destination];
  document.getElementById("currentQuestion").innerHTML = question;

  // Show modal
  document.getElementById("quesModal").style.display = "block";
}

// When wheel stops spinning
wheel.onRest = (event) => {
  // Log result
  console.log(wheelContents.items[wheel.getCurrentIndex()].label);
  currentWheelResult = wheel.getCurrentIndex() + 1;

  // Wait before advancing
  setTimeout(function () {
    // Hide wheel
    document.getElementById("wheelModal").style.display = "none";
    // Show question
    showQuestion();
  }, 1500);
};

// Handle received answer
function quesResult() {
  // Hide modal
  document.getElementById("quesModal").style.display = "none";
  // Take answer given
  let givenAns = Number(document.getElementById("userAns").value);
  // Clear answer field
  document.getElementById("userAns").value = "";

  // If correct, set and drive to new position
  if (givenAns == currentAns) {
    console.log("Correct");
    // Update placement
    placements[pTurn] += currentWheelResult;
    if (placements[pTurn] >= spacesPerPlayer) {
      placements[pTurn] = spacesPerPlayer - 1;
    }

    // Move car
    var car = document.getElementById(`car${pTurn + 1}`);
    car.style.left =
      carBaseX + (placements[pTurn] + 1) * questionWidth + 20 + "px";
  } else {
    console.log("Incorrect");
  }

  // If goal reached, end
  if (placements[pTurn] == spacesPerPlayer - 1) {
    endGame();
  } else {
    // If goal not reached, swap to other player's turn
    pTurn++;
    if (pTurn > 1) {
      pTurn = 0;
    }

    // Update colours for next turn
    var playBtn = document.getElementById("playBtn");
    // Update play button text
    playBtn.innerText = `Play (P${pTurn + 1})`;
    // Update play button colour
    var btnCol;
    playBtn.style.backgroundColor = playerCol[pTurn];
    // Update modal border colour
    wheelDiv.style.borderColor = playerCol[pTurn];
    quesDiv.style.borderColor = playerCol[pTurn];
    // Update modal background colour
    wheelDiv.style.backgroundColor = playerColSecondary[pTurn];
    quesDiv.style.backgroundColor = playerColSecondary[pTurn];
    // Update go button colour
    document.getElementById("goBtn").style.backgroundColor = playerCol[pTurn];
  }
}

// Win
function endGame() {
  // Insert text to end modal
  const endContent = `<h2>Winner!</h2><br /> \
        <p>Player ${pTurn + 1} wins!</p><br /> \
        <a href="./index.html" class="modalBtn btn" id="homeBtn">Home</a> \
        <span \
        onClick="window.location.reload();" \
        class="modalBtn btn" \
        id="replayBtn"> \
        Replay \
        </span>`;
  document.getElementById("endModalContent").innerHTML += endContent;

  document.getElementById("endModal").style.display = "block";

  // Trigger confetti
  const jsConfetti = new JSConfetti();

  jsConfetti.addConfetti({
    confettiColors: [playerCol[pTurn]],
    confettiNumber: 200,
  });
}
