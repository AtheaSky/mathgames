let answers = [];
let questions = [];
let overallValid = false;

// ON REFESH, SETTINGS TO RESET/BLANK
window.onload = function () {
  // Set question type to none
  this.document.getElementById("qType").value = "-- question type --";
  // HIDE create questions button
  document.getElementById("createBtn").style.display = "none";

  // Empty answer input boxes
  this.document.getElementById("a1Box").value = "";
  this.document.getElementById("a2Box").value = "";
  this.document.getElementById("a3Box").value = "";

  // Disable "OPEN" button
  this.document.getElementById("openBtn").disabled = true;
};

// CREATE QUESTIONS BUTTON
function createQuestions() {
  // Hide settings form
  document.getElementById("settings").style.display = "none";

  // Generate numbers
  if (settingsType == "Operator") {
    // Get values from html
    let xMin = +document.getElementById("xMin").value;
    let xMax = +document.getElementById("xMax").value;
    let yMin = +document.getElementById("yMin").value;
    let yMax = +document.getElementById("yMax").value;
    let operator = document.getElementById("operator").value;

    let qa = getQA(3, operator, xMin, xMax, yMin, yMax);

    overallValid = !(qa.length == 0);
    if (overallValid) {
      questions = qa[0];
      answers = qa[1];
    }
  } else if (settingsType == "Custom") {
    overallValid = true;

    for (let i = 0; i < 3; i++) {
      questions.push(document.getElementById(`custQ${i + 1}`).value);
      answers.push(document.getElementById(`custA${i + 1}`).value);
    }
  }

  // Display questions
  if (overallValid) {
    for (let i = 0; i < 3; i++) {
      document.getElementById(`q${i + 1}Box`).innerText = questions[i];
    }
    console.log(answers);

    // Enable "OPEN" button
    document.getElementById("openBtn").disabled = false;
  } else {
    document.getElementById("questionBox").innerText = "INVALID INPUT";
  }
}

// ---------- SETUP MANAGEMENT
let settingsType = "";

// If dropdown changed
document.getElementById("qType").addEventListener("change", function () {
  changeType(this.value);
});

// Show relevant settings
function changeType(settingsTypeIn) {
  settingsType = settingsTypeIn;
  let currentOpt;
  // Set current options based on dropdown selection
  if (settingsType == "Operator") {
    currentOpt = operatorOpt;
    // Show create questions button
    document.getElementById("createBtn").style.display = "inline";
  } else if (settingsType == "Custom") {
    currentOpt = customOpt;
    // Show create questions button
    document.getElementById("createBtn").style.display = "inline";
  } else {
    // HIDE create questions button
    document.getElementById("createBtn").style.display = "none";
  }

  // Update options
  document.getElementById("typedSettings").innerHTML = currentOpt;
}

// Settings
let operatorOpt =
  '<div> \
      X \
      <select id="operator"> \
        <option value="+">+</option> \
        <option value="-">-</option> \
        <option value="×">×</option> \
        <option value="÷">÷</option> \
      </select> \
      Y \
    </div> \
    <br /> \
   \
  <div> \
      <label>X Range:</label> \
      <input type="number" id="xMin" min="1" max="1000" value="1" /> to \
      <input type="number" id="xMax" min="1" max="1000" value="10" /> \
    </div> \
    <div> \
      <label>Y Range:</label> \
      <input type="number" id="yMin" min="1" max="1000" value="1" /> to \
      <input type="number" id="yMax" min="1" max="1000" value="10" /> \
    </div>';

let customOpt =
  '<label for="Question 1">Question 1:</label><br /> \
    <textarea id="custQ1" placeholder="Question"></textarea> \
    <div> \
      <label for="Answer 1">Answer 1:</label> \
      <input type="number" id="custA1" min="0" max="1000" placeholder="#" /> \
    </div> \
    <br /> \
 \
    <label for="Question 2">Question 2:</label><br /> \
    <textarea id="custQ2" placeholder="Question"></textarea> \
    <div> \
      <label for="Answer 2">Answer 2:</label> \
      <input type="number" id="custA2" min="0" max="1000" placeholder="#" /> \
    </div> \
    <br /> \
 \
    <label for="Question 3">Question 3:</label><br /> \
    <textarea id="custQ3" placeholder="Question"></textarea> \
    <div> \
      <label for="Answer 3">Answer 3:</label> \
      <input type="number" id="custA3" min="0" max="1000" placeholder="#" /> \
    </div>';

// -------------------- OPENING VAULT / CHECKING ANSWERS
function openVault() {
  // Check correctness of input answers
  let allCorrect = true;
  let qCount = 0;

  for (const ans of answers) {
    qCount++;
    if (document.getElementById(`a${qCount}Box`).value == ans) {
      document.getElementById(`a${qCount}Box`).disabled = true;
    } else {
      allCorrect = false;
    }
  }
  // If all correct, begin win state
  if (allCorrect) {
    // Disable open button
    document.getElementById("openBtn").disabled = true;

    // Open safe
    document.getElementById("vaultImg").src = "./images/vaultOpening.gif";
    // After gif length, show open
    setTimeout(() => {
      document.getElementById("vaultImg").src = "./images/vaultOpened.png";

      // Trigger confetti
      const jsConfetti = new JSConfetti();
      const emojiConfetti = new JSConfetti();

      emojiConfetti.addConfetti({
        emojis: ["🪙", "💰"],
        emojiSize: 40,
        confettiNumber: 20,
      });

      jsConfetti.addConfetti({
        confettiColors: ["#df0808ff", "#008000", "#0000ff"],
        confettiNumber: 150,
      });

      // Open win modal
      openWinModal();
    }, 4040);
  }
}
