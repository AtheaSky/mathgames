let activeCol = null;

function changeActiveCol(colID) {
  // If clicked was new colour, set new active. Else, clear
  if (`col${colID}` !== activeCol) {
    activeCol = `col${colID}`;
  } else {
    activeCol = null;
  }

  // Unsquare all colours
  for (let i = 1; i <= 8; i++) {
    document.getElementById(`col${i}`).style.borderRadius = "50%";
  }
  // Square new active if not null
  if (activeCol !== null) {
    document.getElementById(activeCol).style.borderRadius = "5px";
  }
}

function updateCol(cell) {
  // Only proceed if active colour is defined
  if (activeCol !== null) {
    // Only add new colour if active is different from current cell
    let shouldNeutralise = document
      .getElementById(cell)
      .classList.contains(activeCol);
    // Remove all other colours
    for (let i = 1; i <= 8; i++) {
      document.getElementById(cell).classList.remove(`col${i}`);
    }
    // Add new colour if new
    if (!shouldNeutralise) {
      document.getElementById(cell).classList.add(activeCol);

      // Check if now in win state
      checkGameState(Number(cell.slice(4)), activeCol);
    }
  }
}

// Win states
const winStates = [
  // Rows
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
  // Columns
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  [4, 8, 12, 16],
  // Diagonals
  [1, 6, 11, 16],
  [4, 7, 10, 13],
];
// Confetti
const jsConfetti = new JSConfetti();

function checkGameState(updatedCellNum, colClass) {
  // Scan winstates for updated cell
  for (let state of winStates) {
    // Check if updated cell is in a winstate
    if (state.includes(updatedCellNum)) {
      // Check if all other cells in said winstate match colour class
      let counter = 0;
      for (let cellNum of state) {
        if (
          document.getElementById(`cell${cellNum}`).classList.contains(colClass)
        ) {
          counter++;
        }
      }
      // If so, win
      if (counter == 4) {
        console.log("Winner");

        // Get winner colour
        let winCol = window.getComputedStyle(
          document.getElementById(`cell${updatedCellNum}`)
        ).backgroundColor;
        console.log(winCol);

        // Trigger colorful confetti
        jsConfetti.addConfetti({
          confettiColors: [winCol],
          confettiNumber: 200,
        });
      }
    }
  }
}
