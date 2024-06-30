function toggleAyahList(buttonElement) {
  console.log(buttonElement)
  const player = buttonElement.parentElement.querySelector(".single-player-2")
  console.log(player);

  const ayahList = player.querySelector('#ayah-list');
  console.log(ayahList);

  // Check if the ayahList element is hidden
  const isHidden = ayahList.classList.contains("hidden");

  // Toggle the visibility of the ayahList
  ayahList.classList.toggle("hidden");

  // Toggle the icon based on the visibility of the ayahList
  if (isHidden) {
    buttonElement.innerHTML = `<i class="fa fa-chevron-down down-icon"></i>`;
  } else {
    buttonElement.innerHTML = `<i class="fa fa-chevron-up up-icon"></i>`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("audioPlayer");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const seekBar = document.getElementById("seekBar");
  const currentTimeDisplay = document.getElementById("currentTime");
  const durationDisplay = document.getElementById("totalDuration");

  audio.addEventListener("loadedmetadata", function () {
    playPauseBtn.disabled = false;
    const duration = audio.duration;
    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = Math.floor(duration % 60);
    durationDisplay.textContent = `${durationMinutes}:${
        durationSeconds < 10 ? "0" : ""
    }${durationSeconds}`;
  });

  // Play and Pause functionality
  playPauseBtn.addEventListener("click", function () {
    if (audio.paused) {
      audio.play();
      playPauseBtn.innerHTML = '<i class="fa fa-pause pause-icon"></i>';
    } else {
      audio.pause();
      playPauseBtn.innerHTML = '<i class="fa fa-play play-icon"></i>';
    }
  });

  // Update seekBar and time display
  audio.addEventListener("timeupdate", function () {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    seekBar.value = (currentTime / duration) * 100;

    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    currentTimeDisplay.textContent = `${currentMinutes}:${
        currentSeconds < 10 ? "0" : ""
    }${currentSeconds}`;

    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = Math.floor(duration % 60);
    durationDisplay.textContent = `${durationMinutes}:${
        durationSeconds < 10 ? "0" : ""
    }${durationSeconds}`;
  });

  // Seek functionality
  seekBar.addEventListener("input", function () {
    const seekTime = (seekBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
  });

  // Reset play button when audio ends
  audio.addEventListener("ended", function () {
    let ayahId = audio.getAttribute("prev_ayah_clone");
    console.log(ayahId);

    let ayahListLoop = document.querySelector(`.ayah-list-loop[data-url="${ayahId}"]`);
    console.log(ayahListLoop);

    let ayahListCounter = ayahListLoop.querySelector(".loop-SummaryCounter");
    console.log(ayahListCounter);

    let dataCounter = ayahListCounter.getAttribute("data-counter");
    ayahListCounter.setAttribute("data-counter", Number(dataCounter) + 1);
    ayahListCounter.textContent = `${Number(dataCounter) + 1}`

    playPauseBtn.innerHTML = '<i class="fa fa-play play-icon"></i>';
  });
});
