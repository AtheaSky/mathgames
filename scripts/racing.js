const spacesPerPlayer = 8;
var pTurn = 1;

// Wheel setup
const wheelContents = {
  radius: 0.9,
  offset: { x: -0.05, y: -0.05 },
  pointerAngle: 90,
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

// wheel.overlayImage("../images/apple.png");

wheel.onRest = (event) => {
  console.log(wheelContents.items[wheel.getCurrentIndex()].label);
};

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
    Questions = [p1qa[0], p2qa[0]];
    Answers = [p1qa[1], p2qa[1]];
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
      document.getElementById(`p${i + 1}q${j + 1}`).innerHTML = Questions[i][j];
    }
  }
}

// ------ GAME PLAY
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

  car.style.left = q1Loc.left - 160 + "px";
  car.style.top = q1Loc.top + 15 + "px";
}

// When play button clicked
function turn() {
  // Show wheel
  document.getElementById("wheelModal").style.display = "block";
}

/////// GRANDFATHERED; WIP
// Handle received answer
function catchResult() {
  creaturesLeft -= 1;
  // Hide modal
  document.getElementById("catchModal").style.display = "none";
  // Take answer given
  let givenAns = Number(document.getElementById("userAns").value);
  // Clear answer field
  document.getElementById("userAns").value = "";

  // If caught, add to side panel
  if (givenAns == answers[currentQuestion]) {
    console.log(`Q${currentQuestion + 1} Correct`);
    creaturesCaught += 1;

    // Show card
    document.getElementById(`card${currentQuestion + 1}`).style.visibility =
      "visible";
    // Show caught creature on card
    document.getElementById(
      `card${currentQuestion + 1}Caught`,
    ).style.visibility = "visible";
  } else {
    console.log(`Q${currentQuestion + 1} Incorrect`);
  }

  // If no fish left, end
  if (creaturesLeft == 0) {
    endGame();
  }
}

function endGame() {
  var endTitle;
  var endBody;

  // Freeze timer
  endState = true;

  // Hide all fish
  for (let i = 1; i <= iniCreatureAmt; i++) {
    document.getElementById(`creature${i}`).style = "visibility: hidden";
  }

  // Congratulate based on fish caught
  if (creaturesCaught == iniCreatureAmt) {
    endTitle = "Congratulations!";
    endBody = "You caught all of the fish!";
  } else if (creaturesCaught > 0) {
    endTitle = "Good job!";
    endBody = `You caught ${creaturesCaught} out of ${iniCreatureAmt} fish!`;
  } else if (creaturesCaught == 0) {
    endTitle = "No more fish!";
    endBody = "All of the fish swam away. Try again!";
  }
  // If time ran out, change title to "Time up!" instead
  if (timeUp) {
    endTitle = "Time up!";
  }

  // Insert text to end modal
  const endContent = `<h2>${endTitle}</h2><br /> \
        <p>${endBody}</p><br /> \
        <a href="./index.html" class="modalBtn btn" id="homeBtn">Home</a> \
        <span \
        onClick="window.location.reload();" \
        class="modalBtn btn" \
        id="replayBtn"> \
        Replay \
        </span>`;
  document.getElementById("endModalContent").innerHTML += endContent;

  document.getElementById("endModal").style.display = "block";

  // Trigger confetti based on caught fish
  const emojiConfetti = new JSConfetti();

  emojiConfetti.addConfetti({
    emojis: ["🐟", "🐠"],
    emojiSize: 40,
    confettiNumber: Math.round(20 * (creaturesCaught / iniCreatureAmt)),
  });

  // Add regular confetti if caught at least one fish
  if (creaturesCaught > 0) {
    const jsConfetti = new JSConfetti();

    // Trigger colorful confetti
    jsConfetti.addConfetti({
      confettiColors: [
        "#ed795f",
        "#fca4b6",
        "#35b297",
        "#6dd2e7",
        "#fc69c5",
        "#f14f55",
      ],
      confettiNumber: 200,
    });
  }
}
