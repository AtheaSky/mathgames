let answers = [];
let questions = [];
let overallvalid;

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

    // ----- DATA VALIDATION
    // Min can not be lower than max (CAN be equal)
    let xValidRange = xMin <= xMax;
    let yValidRange = yMin <= yMax;

    // At least three questions must be able to exist (aa, ab, bb)
    let possible = new Set([xMin, xMax, yMin, yMax]);
    let highestPossible = "";
    let lowestPossible = "";
    for (const num of possible) {
      if (highestPossible == "") {
        highestPossible = num;
        lowestPossible = num;
      } else if (num > highestPossible) {
        highestPossible = num;
      } else if (num < lowestPossible) {
        lowestPossible = num;
      }
    }
    let overallRange = highestPossible - lowestPossible;

    let enoughRange;
    if (xMin == xMax || yMin == yMax) {
      enoughRange = overallRange >= 2;
    } else {
      enoughRange = overallRange >= 1;
    }

    overallValid = xValidRange && yValidRange && enoughRange;

    if (overallValid) {
      // Generate numbers for questions
      let nums = [];
      while (nums.length < 3) {
        // INCLUSIVE INTEGER: Math.floor(Math.random() * (max - min + 1)) + min;
        let pair = [];
        pair.push(Math.floor(Math.random() * (xMax - xMin + 1)) + xMin);
        pair.push(Math.floor(Math.random() * (yMax - yMin + 1)) + yMin);

        // If pair not already in list, add to nums, questions, and set answer
        if (
          !nums.some(
            (numsPair) =>
              JSON.stringify(numsPair) === JSON.stringify(pair) ||
              JSON.stringify(numsPair) ===
                JSON.stringify(pair.slice().reverse())
          )
        ) {
          // Add to nums for duplicate checking
          nums.push(pair);
          // Add to questions list
          questions.push(`${pair[0]} ${operator} ${pair[1]}`);

          // Set answer
          if (operator == "+") {
            answers.push(pair[0] + pair[1]);
          } else if (operator == "-") {
            answers.push(pair[0] - pair[1]);
          } else if (operator == "×") {
            answers.push(pair[0] * pair[1]);
          } else if (oerator == "÷") {
            answers.push(pair[0] / pair[1]);
          }
        }
      }
    }
  } else if (settingsType == "Custom") {
    overallvalid = true;

    for (let i = 0; i < 3; i++) {
      questions.push(document.getElementById(`custQ${i + 1}`).value);
      answers.push(document.getElementById(`custA${i + 1}`).value);
    }
    // q1 = document.getElementById("custQ1").value;
    // q2 = document.getElementById("custQ2").value;
    // q3 = document.getElementById("custQ3").value;

    // a1 = document.getElementById("custA1").value;
    // a2 = document.getElementById("custA2").value;
    // a3 = document.getElementById("custA3").value;
  }

  // Display questions
  if (overallvalid) {
    for (let i = 0; i < 3; i++) {
      document.getElementById(`q${i + 1}Box`).innerText = questions[i];
    }
    console.log(answers);
  } else {
    document.getElementById("questionBox").innerText = "INVALID INPUT";
  }
}

let settingsType = "";
// ---------- SETUP MANAGEMENT
// Reset selection on refresh
window.onload = function () {
  this.document.getElementById("qType").value = "-- question type --";
  // HIDE create questions button
  document.getElementById("createBtn").style.display = "none";
};

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
