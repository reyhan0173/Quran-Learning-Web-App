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

function trackNumberInput(loopElement, newValue) {
  // console.log(`Number input changed to ${value} for ${ayahId}`);
  loopElement.parentElement.parentElement
    .querySelector(".ayah-control-button")
    .setAttribute("data-loop", newValue);

  console.log(loopElement)
  loopElement.setAttribute('value', newValue)
  console.log(loopElement)

  const loopCounterElement =
    loopElement.parentElement.querySelector(".loop-counter");
  loopCounterElement.setAttribute("data-loop", newValue);
  
  let count = loopCounterElement.getAttribute("data-count");
  loopCounterElement.textContent = `${count}/${newValue}`;
}

async function fetchAudioUrl(ayahId, recitor) {
  const api = `https://api.quran.com/api/v4/recitations/${recitor}/by_ayah/${ayahId}`;

  const response = await fetch(api);
  if (!response.ok) {
    throw new Error("Failed to fetch data: " + response.statusText);
  }
  const data = await response.json();
  const directory = data.audio_files[0].url;
  const audioUrl = `https://verses.quran.com/${directory}`;

  return audioUrl;
}

async function playPauseAudio(buttonElement) {
  const playPauseBtn = document.getElementById("playPauseBtn");

  console.log(buttonElement.parentElement.parentElement);

  let recitor = 4;
  let ayahId = buttonElement.getAttribute("data-ayahId");
  console.log(ayahId);

  const loopCounterElement =
    buttonElement.parentElement.parentElement.querySelector(".loop-counter");

  const audioElement = document.querySelector("audio");
  if (!audioElement) {
    console.log("Audio element not found");
  }

  console.log(audioElement.getAttribute('prev_ayah'))
  console.log(audioElement.getAttribute('prev_recitor'))
  if (
    ayahId == audioElement.getAttribute('prev_ayah') &&
    recitor == audioElement.getAttribute('prev_recitor')
  ) {
    if (audioElement.paused) {
      audioElement.play();
      playPauseBtn.innerHTML = '<i class="fa fa-pause pause-icon"></i>';

    } else {
      audioElement.pause();
      playPauseBtn.innerHTML = '<i class="fa fa-play play-icon"></i>';
    }
    return;
  } else {
    audioElement.src = await fetchAudioUrl(ayahId, recitor);
    audioElement.setAttribute('prev_ayah', ayahId);
    audioElement.setAttribute('prev_ayah_clone', ayahId);
    audioElement.setAttribute('prev_recitor', recitor);
  }

  console.log(audioElement.getAttribute('prev_ayah'))
  console.log(audioElement.getAttribute('prev_recitor'))

  console.log(`data-count: ${loopCounterElement.getAttribute("data-count")}`);

  let i = loopCounterElement.getAttribute("data-count");
  let loop = buttonElement.getAttribute("data-loop");
  if (i >= loop || i == 0) {
    i = 0;
    loopCounterElement.setAttribute("data-count", 0);
    loopCounterElement.textContent = `${i}/${loop}`;
  }


  while (i < loop) {
    console.log("played");
    await audioElement.play();
    
    playPauseBtn.innerHTML = '<i class="fa fa-pause pause-icon"></i>';

    await new Promise((resolve) => {
      audioElement.onended = resolve;
    });

    loop = buttonElement.getAttribute("data-loop");
    loopCounterElement.textContent = `${Number(i) + 1}/${loop}`;
    loopCounterElement.setAttribute("data-count", Number(i) + 1);

    i++;
  }

  console.log("paused");
  audioElement.setAttribute('prev_ayah', 'None');
  audioElement.setAttribute('prev_recitor', 'None');
}

async function bookmark(current_posStr) {
  // Check if the button has the "isBookmarked" class to determine whether to add or remove a bookmark
  const buttonElement = document.querySelector(
    `[data-url='${current_posStr}'] .ayah-bookmark-button`
  );

  console.log(buttonElement);
  const isBookmarked =
    buttonElement.parentElement.parentElement.classList.contains(
      "isBookmarked"
    );

  const endpoint = isBookmarked ? "/removeBookmark" : "/addBookmark";
  const method = "POST";

  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ current_posStr }),
    });
    if (!response.ok) {
      throw new Error(`Failed to ${isBookmarked ? "remove" : "add"} bookmark`);
    }
    // Optionally, you can handle success response here
    // Toggle bookmark status
    buttonElement.parentElement.parentElement.classList.toggle("isBookmarked");
    buttonElement.textContent = isBookmarked ? "Bookmark" : "Unbookmark";
  } catch (error) {
    console.error(
      `Error ${isBookmarked ? "removing" : "adding"} bookmark:`,
      error
    );
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
