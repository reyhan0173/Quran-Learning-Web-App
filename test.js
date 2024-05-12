const express = require("express");
const ourApp = express();
ourApp.use(express.urlencoded({ extended: false }));

// Serve static files from the 'public' directory
ourApp.use(express.static("public"));

ourApp.get("/", (req, res) => {
  res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quran App Test</title>
          <link rel="stylesheet" href="/styles/main.css">
        </head>
        <body>
          <h1>Quran App</h1>
          <form action="/play" method="POST">
            <button type="submit" class="play">Play</button>
          </form>
        </body>
      </html>
    `);
});

// Dynamically import node-fetch
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function fetchChapterRecitation(reciterId, chapterNumber) {
  const url = `https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${chapterNumber}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data: " + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was an error:", error.message);
    return { error: error.message }; // Optionally handle the error or return it
  }
}

async function play() {
  try {
    const data = await fetchChapterRecitation(22, 3); // Surah 1 (Al-Fatiha)
    return JSON.stringify(data["audio_file"]["audio_url"]); // Send the fetched data as a JSON response
  } catch (error) {
    return "Error fetching data";
  }
}

ourApp.post("/play", async (req, res) => {
  const audioUrl = await play();
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Quran App Test</title>
        <link rel="stylesheet" href="/styles/main.css">
      </head>
      <body>
        <h1>Quran App</h1>
        <p>Now playing: ${audioUrl}</p>
        <audio class="audio-player" src=${audioUrl} autoplay controls></audio>
        <form action="/" method="GET">
          <button type="submit" class="play">Back</button>
        </form>
      </body>
    </html>
  `);
});

ourApp.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
