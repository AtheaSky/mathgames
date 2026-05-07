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

//-----GAME SETUP
const introModal = document.getElementById("introModal");
introModal.style.display = "block";
function start(operator) {
  var op = operator;

  // Close modal
  introModal.style.display = "none";

  // Cont
}
