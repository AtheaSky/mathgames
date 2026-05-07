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
  // Hide modal
  document.getElementById("catchModal").style.display = "none";
  // Take answer given
  let givenAns = Number(document.getElementById("userAns").value);
  // Clear answer field
  document.getElementById("userAns").value = "";

  // If caught, add to side panel
  if (givenAns == answers[currentQuestion]) {
    console.log(`Q${currentQuestion + 1} Correct`);

    // Show card
    document.getElementById(`card${currentQuestion + 1}`).style.visibility =
      "visible";
    // Add image to card
    //

    // If no fish left, end
    //
  } else {
    console.log(`Q${currentQuestion + 1} Incorrect`);
  }
}
