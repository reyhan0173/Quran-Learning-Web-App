function trackNumberInput(buttonElement, newValue) {
  // console.log(`Number input changed to ${value} for ${ayahId}`);
  buttonElement.setAttribute('data-loop', newValue);
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
  console.log(buttonElement);
  let recitor = 4;
  let ayahId = buttonElement.getAttribute("data-ayahId");
  let loop = buttonElement.getAttribute("data-loop");

  const audioElement = document.querySelector("audio");
  if (!audioElement) {
    console.log("Audio element not found");
  }

  if (
    ayahId == audioElement.prev_ayah &&
    recitor == audioElement.prev_recitor
  ) {
    console.log("paused");
    audioElement.pause();
    audioElement.prev_ayah = "";
    audioElement.prev_recitor = "";
    return;
  }

  for (i = 0; i < loop; i++) {
    console.log("played");
    if (
      audioElement.prev_src_ayah != ayahId ||
      audioElement.prev_src_recitor != recitor
    ) {
      audioElement.src = await fetchAudioUrl(ayahId, recitor);

      audioElement.prev_src_ayah = ayahId;
      audioElement.prev_src_recitor = recitor;
    }

    await audioElement.play();
    audioElement.prev_ayah = ayahId;
    audioElement.prev_recitor = recitor;

    await new Promise((resolve) => {
      audioElement.onended = resolve;
    });
  }

  console.log("paused");
  audioElement.prev_ayah = "";
  audioElement.prev_recitor = "";
}

async function bookmark(current_posStr) {
  try {
    const response = await fetch("/bookmark", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ current_posStr }),
    });
    if (!response.ok) {
      throw new Error("Failed to bookmark ayah");
    }
    // Optionally, you can handle success response here
  } catch (error) {
    console.error("Error bookmarking ayah:", error);
  }
}
