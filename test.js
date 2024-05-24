const express = require("express");
const ourApp = express();
const { promisify } = require("util");
const Surah = require("./Surah");
ourApp.use(express.json());

const portNumber = 5001;

const User = {
  studentId: 121,
  courseId: 123,
};

// Functions in bookmarkFunctions.js
// isBookmarked(studentId, courseId, surahNumber, ayahNumber) returns 1 if bookmarked or 0 otherwise

// isBookmarked(studentId, courseId, surahNumber, ayahNumber) returns 1 if successfully added and console.logs "Successfully added a bookmark at {surahNumber:ayahNumber}" or logs the error and returns 0

// removeBookmark(studentId, courseId, surahNumber, ayahNumber) returns 1 if successfully removed and console.logs "Successfully removed the bookmark at {surahNumber:ayahNumber}" or logs the error and returns 0

// Serve static files from the 'public' directory
ourApp.use(express.urlencoded({ extended: false }));
ourApp.use(express.static("public"));
ourApp.set("view engine", "ejs"); // Set EJS as the template engine

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function getAyahCount(surahNumber) {
  try {
    const result = await Surah.findOne({
      where: { SurahNumber: surahNumber },
      attributes: ["NumberOfVerses"],
    });
    return result ? result.NumberOfVerses : null;
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
  const data = await response.json();
  return data.verses[0].text_indopak;
}

// Function to fetch mistake indexes for each verse from the database
async function getMistakeIndexes(start_pos, end_pos) {
  // Fetch mistake indexes from database based on the range of verses
  // Return a map with verse numbers as keys and corresponding mistake indexes as values
}

function ayahWithButtons(current_posStr, verse, recitor=4, loop=4) {
  // _isBookmarked = isBookmarked(studentId, courseId, surahNumber, ayahNumber);
  let _isBookmarked = 1;
  
  let highlightedVerse = "";
  
  for (let i = 0; i < verse.length; i++) {
    const char = verse[i];
    if (mistakeIndexes.includes(i)) {
      highlightedVerse += `<span class="mistake">${char}</span>`; // Apply highlighting to the characters with mistake indexes
    } else {
      highlightedVerse += char;
    }
  }
  
  return `
    <div class="ayah-container ${
      _isBookmarked ? "isBookmarked" : ""
    }" data-url="${current_posStr}">
      <div class="ayah-controls">
        <button data-ayahId="${current_posStr}"
          class="ayah-control-button" data-loop="${loop}"
          onclick="playPauseAudio(this)"
        >
          play/pause
        </button>
        <button
          class="ayah-bookmark-button" onclick="bookmark('${current_posStr}')"
        >
          Bookmark
        </button>
      </div>

      <div class="ayah_con">
      <p class="ayah">${verse}</p>
      </div>
      <div class="number-input-container">
        <p class="loop-counter" data-count=0 data-loop=${loop}>0/${loop}</p>
        <input type="number" class="loop-number-input" value="${loop}" min="0" max="100" step="1" onchange="trackNumberInput(this, this.value)">
      </div>
    </div>
  `;
}

async function getAyahsText(start_pos, end_pos) {
  start_pos = start_pos.split(":").map(Number);
  end_pos = end_pos.split(":").map(Number);

  let current_pos = start_pos;
  let promises = [];

  while (current_pos[0] !== end_pos[0] || current_pos[1] !== end_pos[1] + 1) {
    if (current_pos[1] > (await getAyahCount(current_pos[0]))) {
      current_pos[0] += 1;
      current_pos[1] = 1;
    } else {
      let current_posStr = `${current_pos[0]}:${current_pos[1]}`;
      promises.push(
        fetchVerse(current_posStr).then((verse) => ({ current_posStr, verse }))
      );
      current_pos[1] += 1;
    }
  }

  const verses = await Promise.all(promises);
  const mistakeIndexesMap = await getMistakeIndexes(start_pos, end_pos);
  let htmlContent = "";

  verses.forEach(({ current_posStr, verse }) => {
    htmlContent += ayahWithButtons(current_posStr, verse);
  });

  return htmlContent;
}

ourApp.get("/", async (req, res) => {
  try {
    const START_POSITION = "108:3";
    const END_POSITION = "112:2";
    const ayaHtml = await getAyahsText(START_POSITION, END_POSITION);
    res.render("index", { ayaHtml });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Internal Server Error");
  }
});

bookmark = (current_posStr) => {
  console.log(current_posStr);
};

ourApp.post("/bookmark", async (req, res) => {
  try {
    const { current_posStr } = req.body;
    // Implement the logic to handle the bookmark action (e.g., save to database)
    bookmark(current_posStr);
    res.status(200).send("Bookmark saved successfully");
  } catch (error) {
    console.error("Error handling bookmark:", error);
    res.status(500).send("Internal Server Error");
  }
});

ourApp.listen(portNumber, () => {
  console.log(`Server running on http://localhost:${portNumber}`);
});
