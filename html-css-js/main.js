async function fetchAyahRecitation(parameters) {
  const url = `https://api.quran.com/api/v4/recitations/3/by_ayah/${parameters}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data: " + response.statusText);
  }
  const data = await response.json();
  return data;
}

async function playAudio(data_url) {
  const data = await fetchAyahRecitation(data_url);
  const audio_data = data["audio_files"];
  const audio_url = audio_data[0]["url"];

  audioPlayer.src = `https://verses.quran.com/${audio_url}`;
  audioPlayer.play();
}

async function fetchVerse(data_url) {
  const response = await fetch(data_url);
  if (!response.ok) {
    throw new Error("Failed to fetch data: " + response.statusText);
  }
  const data = await response.json();
  const verse = data.verses[0].text_indopak
  return verse
}

async function showAyah(object) {
  data_url = `https://api.quran.com/api/v4/quran/verses/indopak?verse_key=${object.getAttribute(
    "data-url"
  )}`;
  const verse = await fetchVerse(data_url);
  return verse
}

async function playPauseAudio(object) {
  object.querySelector(".ayah").textContent = await showAyah(object);
  data_url = object.getAttribute("data-url");
  const myAudio = document.querySelector("#audioPlayer");
  console.log(myAudio)
  if (!myAudio) {
    console.error("No audio player element found");
    return;
  }
  if (myAudio.paused) {
    console.log("played");
    playAudio(data_url, object);
  } else {
    console.log("paused");
    myAudio.pause();
  }
}
