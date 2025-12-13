function genBoard() {
  // Hide settings form
  document.getElementById("boardSettings").style.display = "none";
  // Hide instructions box
  document.getElementById("instructionsBox").style.display = "none";
  // Show extra drawing space
  document.getElementById("drawSpace").style.padding = "200px";

  // Generate board
  let boardMin = +document.getElementById("boardMin").value;
  let boardMax = +document.getElementById("boardMax").value;

  let board = [];
  while (board.length < 16) {
    let isDuplicate = true;
    while (isDuplicate) {
      // Gen number in range
      let rand =
        boardMin + Math.floor(Math.random() * (boardMax - boardMin + 1));

      // If not already in list add and continue. Else, try again
      isDuplicate = board.includes(rand);
      if (!isDuplicate) {
        board.push(rand);
      }
    }
  }
  // Insert board numbers
  for (let i = 0; i < 16; i++) {
    document.getElementById(`cell${i + 1}`).innerHTML = board[i];
  }

  // Generate your numbers
  let yourMax = +document.getElementById("yourMax").value;

  let yourNums = [];
  // Two lower half
  while (yourNums.length < 2) {
    let isDuplicate = true;
    while (isDuplicate) {
      // INCLUSIVE INTEGER: Math.floor(Math.random() * (max - min + 1)) + min;
      let rand = Math.floor(Math.random() * Math.floor(yourMax / 2)) + 1;

      isDuplicate = yourNums.includes(rand);
      if (!isDuplicate) {
        yourNums.push(rand);
      }
    }
  }
  // Two upper  half
  while (yourNums.length < 4) {
    let isDuplicate = true;
    while (isDuplicate) {
      // INCLUSIVE INTEGER: Math.floor(Math.random() * (max - min + 1)) + min;
      let rand = Math.floor(
        Math.random() * (yourMax - Math.floor(yourMax / 2) + 1) +
          Math.floor(yourMax / 2)
      );

      isDuplicate = yourNums.includes(rand);
      if (!isDuplicate) {
        yourNums.push(rand);
      }
    }
  }

  // Insert your numbers
  for (let i = 0; i < 4; i++) {
    document.getElementById(`num${i + 1}`).innerHTML = yourNums[i];
  }
}
