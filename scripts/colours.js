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
    }
  }
}
