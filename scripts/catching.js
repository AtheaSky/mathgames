// Amount of image options that exist for each animal (SET MANUALLY)
const variants = {
  fish: 6,
};
const iniCreatureAmt = 6;

// Place animals
let varPool = [];
// let varOrder = [];
for (let i = 1; i <= 6; i++) {
  // Evenly randomise creature colours
  if (varPool.length == 0) {
    for (var j = 1; j <= variants["fish"]; j++) {
      varPool.push(j);
    }
  }
  let randVar = varPool[Math.floor(Math.random() * varPool.length)];
  varPool = varPool.filter((item) => item !== randVar);

  // Place and record image in creature and card tables
  document.getElementById(`creature${i}`).src = `./images/fish${randVar}.png`;
  document.getElementById(`card${i}Caught`).src = `./images/fish${randVar}.png`;
  // varOrder[i - 1] = randVar;
}
// console.log(varOrder);

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

  let qa = getQA(6, operator, xMin, xMax, yMin, yMax);

  overallValid = !(qa.length == 0);
  if (overallValid) {
    questions = qa[0];
    answers = qa[1];
  }
  console.log(qa);
}

// Randomise creature positioning
document.querySelectorAll(".creature").forEach((creature) => {
  var directions = ["+", "-"];
  var xDir = directions[Math.floor(Math.random() * directions.length)];
  var yDir = directions[Math.floor(Math.random() * directions.length)];
  var xMod = Math.floor(Math.random() * 120);
  var yMod = Math.floor(Math.random() * 120);

  creature.style.marginLeft = xDir + xMod + "px";
  creature.style.marginTop = yDir + yMod + "px";
});

// ------ GAME PLAY
var creaturesLeft = iniCreatureAmt;
var creaturesCaught = 0;
let currentQuestion;

// When roaming creature clicked
function catchAttempt(creatureId) {
  // Set target
  currentQuestion = Number(creatureId.replace("creature", "")) - 1;
  // Insert question
  document.getElementById("currentQuestion").innerText =
    questions[currentQuestion];
  // Show modal
  document.getElementById("catchModal").style.display = "block";
  // Hide creature
  document.getElementById(creatureId).style.visibility = "hidden";
}

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
    var endTitle;
    var endBody;
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
    //STUB

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

    // If all caught, add some regular confetti
    if (creaturesCaught == iniCreatureAmt) {
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
}
