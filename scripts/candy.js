//-----GAME SETUP
let twoPlayers, goal;
let numAnswered = 0;

let xMin, xMax, yMin, yMax, operator;

const introModal = document.getElementById("introModal");
introModal.style.display = "block";

function getQuestion() {
  let qa = getQA(1, operator, xMin, xMax, yMin, yMax);
  return qa;
}

let cardBounds = [];
function getCardPos() {
  for (let i = 0; i < 3; i++) {
    var card = document.getElementById(`card${i}`).getBoundingClientRect();
    var leftBase = (card.left + card.right) / 2;
    var topBase = (card.top + card.bottom) / 2;
    cardBounds.push([leftBase, topBase]);
  }
}

function start() {
  // Close modal
  introModal.style.display = "none";

  // Get values from html
  xMin = +document.getElementById("xMin").value;
  xMax = +document.getElementById("xMax").value;
  yMin = +document.getElementById("yMin").value;
  yMax = +document.getElementById("yMax").value;
  operator = document.getElementById("operator").value;

  // For 2 players:
  twoPlayers = !(document.getElementById("p2Style").value == "OFF");
  let p1 = document.getElementById("player1");
  let p2 = document.getElementById("player2");
  if (twoPlayers) {
    // Display sections for player 2 ghost and candy
    p2.style.display = "inline";
    document.getElementById("p2ScoreBox").style.display = "inline";
    // Get and display goal
    goal = +document.getElementById("goal").value;
    displayGoal();
  }

  // Get timer if singleplayer
  let timerStart = +document.getElementById("timerSetting").value;
  if (!twoPlayers) {
    // var totalSec = timerStart * 60;
    timer(Math.floor(timerStart), (timerStart - Math.floor(timerStart)) * 60);
  }

  // Set ghost style(s) and fade in
  let p1Style = document.getElementById("p1Style").value;
  p1.src = `./images/ghost_${p1Style}.png`;
  p1.style.animation = "fadeInFull 2s";

  if (twoPlayers) {
    let p2Style = document.getElementById("p2Style").value;
    p2.src = `./images/ghost_${p2Style}.png`;
    p2.style.animaion = "fadeInHalf 2s";
    p2.style.opacity = 0.3;
  }

  // Display relevant candy score(s)
  document.getElementById("p1ScoreBox").style.visibility = "visible";
  if (twoPlayers) {
    document.getElementById("p2ScoreBox").style.visibility = "visible";
  }

  // Save card positions
  getCardPos();

  // Get first question
  nextQuestion();
}

// ------ GAME PLAY
var p1Score = 0;
var p2Score = 0;
let currentAns;
let playerTurn = 1;
var timeUp = false;
var endState = false;

// Start timer function
function timer(startingMins, startingSecs) {
  let container = document.getElementById("objective");
  container.style = "visible";
  var min = startingMins;
  var sec = startingSecs;

  var timer = setInterval(function () {
    if (endState) {
      clearInterval(timer);
    }

    // If seconds under 10, add leading 0
    var secStr = sec;
    if (sec < 10) {
      secStr = `0${sec}`;
    }

    // Show current timer
    container.innerHTML = `${min}:${secStr}`;
    sec--;

    // When seconds reach 0
    if (sec < 0) {
      // If minutes left, decrement
      if (min > 0) {
        min -= 1;
        sec = 59;

        // If 1 minute left, turn yellow
        if (min == 0) {
          container.style = "color: #a14c17";
        }
      } else {
        // Else, end
        clearInterval(timer);
        timeUp = true;
        container.style = "color: #751b1b";
        endGame(p1Score);
      }
    }
  }, 1000);
}

// Show goal function
function displayGoal() {
  let container = document.getElementById("objective");
  container.style = "visible";
  container.innerText = `Goal: ${goal}`;
}

// Populate question and answer cards
function nextQuestion() {
  // Get QA
  let qa = getQuestion();
  let question = qa[0][0];
  let answer = qa[1][0];
  console.log(`${question} = ${answer}`);

  // Display question
  document.getElementById("questionContainer").innerText = question;

  // Save answer
  currentAns = answer;

  // Create 2 fake answers
  let answers = [];
  answers.push(answer);
  if (operator == "+" || operator == "-") {
    let ansMin = currentAns - 10;
    if (ansMin < 0) {
      ansMin = 0;
    }
    let ansMax = currentAns + 10;

    while (answers.length < 3) {
      let newAns = Math.floor(Math.random() * ansMax) + ansMin;
      if (!answers.includes(newAns)) {
        answers.push(newAns);
      }
    }
  } else {
    let fac1 = Number(Array.from(question)[0]);
    // let fac2 = Number(question.slice(-1));

    let tentative = [];
    tentative.push(answer - fac1);
    tentative.push(answer + fac1);
    for (let i = 0; i < 2; i++) {
      if (tentative[i] < 0) {
        tentative[i] = 0;
      }
      answers.push(tentative[i]);
    }
  }

  // Shuffle order
  answers.sort(() => Math.random() - 0.5);

  // Display answer cards
  for (let i = 0; i < 3; i++) {
    let leftOffset;
    if (answers[i] > 9) {
      leftOffset = 25;
    } else {
      leftOffset = 10;
    }
    var answerText = document.getElementById(`ans${i}`);
    answerText.style.left = cardBounds[i][0] - leftOffset + "px";
    answerText.style.top = cardBounds[i][1] - 20 + "px";

    answerText.innerText = answers[i];
  }
}

// When answer card clicked
function answerAttempt(ansCardId) {
  // Increment questions answered count
  numAnswered++;

  // IF CORRECT:
  let ansChose = document.getElementById(`ans${ansCardId}`).innerText;
  if (ansChose == currentAns) {
    // Hop animation
    player = document.getElementById(`player${playerTurn}`);
    player.style.animation = "hop 0.35s ease-in 0s 2";

    // Increase candy score
    if (playerTurn == 1) {
      p1Score++;
      document.getElementById(`p1Score`).innerText = p1Score;
    } else {
      p2Score++;
      document.getElementById(`p2Score`).innerText = p2Score;
    }
  }

  // If 2-player
  if (twoPlayers) {
    // If score goal met, end game
    if (p1Score == goal || p2Score == goal) {
      let winner;
      if (p1Score == goal) {
        winner = 1;
      } else {
        winner = 2;
      }
      endGame(goal, winner);
    } else {
      // Else, swap player turn
      playerTurn++;
      if (playerTurn > 2) {
        playerTurn = 1;
      }

      // Change ghost opacities
      let p1 = document.getElementById("player1");
      let p2 = document.getElementById("player2");
      if (playerTurn == 1) {
        p1.style.opacity = 1;
        p1.style.animation = "fadeFromHalf 1s";
        p2.style.opacity = 0.3;
        p2.style.animation = "fadeOutHalf 1s";
      } else {
        p2.style.opacity = 1;
        p2.style.animation = "fadeFromHalf 1s";
        p1.style.opacity = 0.3;
        p1.style.animation = "fadeOutHalf 1s";
      }
    }
  }

  // Next question
  nextQuestion();
}

function endGame(candy = NaN, winner = null) {
  var endTitle;
  var endBody;

  // Freeze timer
  endState = true;

  // Congratulate based on players / winner
  if (twoPlayers) {
    endTitle = `Player ${winner} wins!`;
    endBody = `You found ${candy} candy first. Congratulations!`;
  } else if (timeUp) {
    endTitle = "Time up!";
    endBody = `You found ${candy} out of ${numAnswered} candies. Congratulations!`;
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

  // Trigger confetti
  const emojiConfetti = new JSConfetti();

  emojiConfetti.addConfetti({
    emojis: ["🍬", "🍫", "🍭"],
    emojiSize: 40,
    confettiNumber: Math.round(20),
  });

  // Add regular confetti if caught at least one animals

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
