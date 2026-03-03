const winModal = `<div class="modal" id="winModal"> \
    <div class="modal-content"> \
    <p>Congratulations!</p> \
    <a href="./index.html" class="modalBtn" id="homeBtn">Home</a> \
    <span \
        onClick="window.location.reload();" \
        class="modalBtn" \
        id="replayBtn"> \
        Replay \
        </span> \
    </div> \
</div>`;

// Insert win modal into page called from
document.querySelector("body").innerHTML += winModal;

// Open win modal
function openWinModal() {
  document.getElementById("winModal").style.display = "block";
}
