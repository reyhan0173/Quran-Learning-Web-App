const express = require("express");
const ourApp = express();
const { promisify } = require("util");

// Serve static files from the 'public' directory
ourApp.use(express.urlencoded({ extended: false }));
ourApp.use(express.static("public"));
ourApp.set("view engine", "ejs"); // Set EJS as the template engine

const fetch = (...args) =>
import("node-fetch").then(({ default: fetch }) => fetch(...args));

const sqlite3 = require("sqlite3").verbose();

// Connect to the database
let db = new sqlite3.Database("surah_info.db", (err) => {
  if (err) {
    console.error("Could not connect to database", err);
  } else {
    console.log("Connected to the SQLite database");
  }
});

function eachAsync(db, sql, params) {
  return new Promise((resolve, reject) => {
    let results = [];
    db.each(
      sql,
      params,
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          results.push(row.AyahCount);
        }
      },
      (err, numRows) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
}

async function getAyahCount(surahNumber) {
  try {
    const results = await eachAsync(
      db,
      "SELECT AyahCount FROM SurahAyahCount WHERE SurahNumber = ?",
      [surahNumber]
    );
    return results[0];
  } catch (err) {
    console.error(err);
  }
}

async function fetchVerse(ayah) {
  const verse_url = `https://api.quran.com/api/v4/quran/verses/indopak?verse_key=${ayah}`;
  console.log(verse_url);

  const response = await fetch(verse_url);
  if (!response.ok) {
    throw new Error("Failed to fetch data: " + response.statusText);
  }
  const data = await response.json()
  return data.verses[0].text_indopak
}

function ayahWithButtons(current_posStr, verse, recitor=3) {
  return `
    <div class="ayah-container" data-url="${current_posStr}">
      <div class="ayah-controls">
        <button
          class="ayah-control-button"
          onclick="playPauseAudio('${current_posStr}', ${recitor})"
        >
          play/pause
        </button>
      </div>

      <div class="ayah_con">
        <p class="ayah">${verse}</p>
      </div>
    </div>
  `;
}

async function getAyahsText(start_pos, end_pos) {
  start_pos = start_pos.split(":").map(Number);
  end_pos = end_pos.split(":").map(Number);

  let current_pos = start_pos;
  let ayahsInCurrentSurah = await getAyahCount(current_pos[0]);
  let verse = ""
  let htmlContent = "";

  while (current_pos[0] != end_pos[0] || current_pos[1] != end_pos[1] + 1) {
    if (current_pos[1] > ayahsInCurrentSurah) {
      current_pos[0] += 1;
      current_pos[1] = 1;
      ayahsInCurrentSurah = await getAyahCount(current_pos[0]);
    } else {
      current_posStr = `${current_pos[0]}:${current_pos[1]}`
      verse = await fetchVerse(current_posStr)

      htmlContent += ayahWithButtons(current_posStr, verse);
      current_pos[1] = current_pos[1] + 1;
    }
  }
  return htmlContent;
}



ourApp.get("/", async (req, res) => {
  try {
    const START_POSITION = "100:2";
    const END_POSITION = "114:5";
    const ayahText = await getAyahsText(START_POSITION, END_POSITION);
    res.render("index", { ayahText });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Internal Server Error");
  }
});

ourApp.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
