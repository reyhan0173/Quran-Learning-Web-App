async function fetchAyahRecitation(parameters) {
  const url = `https://api.quran.com/api/v4/${parameters}`;
  console.log(url);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data: " + response.statusText);
  }
  const data = await response.json();
  return data;
}

async function playAudio(data_url, object) {
  const data = await fetchAyahRecitation(data_url);
  const audio_data = data["audio_files"]
  const audio_url = audio_data[0]["url"]
  const audioPlayer = object.querySelector('#audioPlayer'); // Ensure this selector is correct

  console.log(`${audio_url}`)
  audioPlayer.src = `https://verses.quran.com/${audio_url}`
  console.log(audioPlayer)
  audioPlayer.play()
}

function playPauseAudio(object) {
  data_url = object.getAttribute("data-url");
  const myAudio = object.querySelector("#audioPlayer");

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
