async function fetchAudioUrl(ayah_id, recitor) {
  const api = `https://api.quran.com/api/v4/recitations/${recitor}/by_ayah/${ayah_id}`;

  const response = await fetch(api);
  if (!response.ok) {
    throw new Error("Failed to fetch data: " + response.statusText);
  }
  const data = await response.json();
  const directory = data.audio_files[0].url;
  const audioUrl = `https://verses.quran.com/${directory}`;

  return audioUrl;
}

async function playPauseAudio(ayah_id, recitor, loop=3) {
  const audioElement = document.querySelector("audio");
  if (!audioElement) {
    console.log("Audio element not found");
  }

  if (
    ayah_id == audioElement.prev_ayah &&
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
      audioElement.prev_src_ayah != ayah_id ||
      audioElement.prev_src_recitor != recitor
    ) {
      audioElement.src = await fetchAudioUrl(ayah_id, recitor);
      audioElement.prev_src_ayah = ayah_id;
      audioElement.prev_src_recitor = recitor;
    }

    await audioElement.play();
    audioElement.prev_ayah = ayah_id;
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
    const response = await fetch('/bookmark', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ current_posStr })
    });
    if (!response.ok) {
      throw new Error('Failed to bookmark ayah');
    }
    // Optionally, you can handle success response here
  } catch (error) {
    console.error('Error bookmarking ayah:', error);
  }
}
