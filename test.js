const express = require("express");
const ourApp = express();
const { promisify } = require("util");
const Surah = require("./Surah");
const mistakes = require("./mistakesFormatting");
const Bookmark = require("./bookmarkFormatting");
ourApp.use(express.json());

const portNumber = 5001;

const User = {
  studentId: 1111115,
  courseId: 123,
};

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


async function renderAyahContainer(current_posStr, verse, recitor=4, loop=4) {
  let [surahNumber, ayahNumber] = current_posStr.split(":").map(Number);
  
  console.log(User.studentId, User.courseId, surahNumber, ayahNumber)

  let _isBookmarked = await Bookmark.isBookmarked(User.studentId, User.courseId, surahNumber, ayahNumber);

  console.log(_isBookmarked)

  let mistakeIndexes = await mistakes.hasMistake(current_posStr)
  console.log(current_posStr);
  console.log(mistakeIndexes);
  
  let mistakesVerse = "";
  
  if (Array.isArray(mistakeIndexes)) {
    for (let i = 0; i < verse.length; i++) {
      const char = verse[i];
      if (mistakeIndexes.includes(i)) {
        mistakesVerse += `<span class="mistake">${char}</span>`; // Apply highlighting to the characters with mistake indexes
      } else {
        mistakesVerse += char;
      }
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
          ${_isBookmarked ? "Unbookmark" : "Bookmark"}
        </button>
      </div>

      <div class="ayah_con">
      <p class="ayah">${mistakesVerse ? mistakesVerse : verse}</p> <!-- Display highlighted verse if available, otherwise display original verse -->
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
  let htmlContent = "";

  // verses.forEach(({ current_posStr, verse }) => {
  //   htmlContent +=  renderAyahContainer(current_posStr, verse);
  //  
  // });
  
  for (const { current_posStr, verse } of verses) {
    htmlContent += await renderAyahContainer(current_posStr, verse); // Wait for each call to finish before proceeding
  }
  
  return htmlContent;
}

ourApp.get("/", async (req, res) => {
  try {
    const START_POSITION = "5:8";
    const END_POSITION = "5:20";
    const ayaHtml = await getAyahsText(START_POSITION, END_POSITION);
    res.render("index", { ayaHtml });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Internal Server Error");
  }
});

ourApp.post("/addBookmark", async (req, res) => {
  try {
    const { current_posStr } = req.body;
    let [surahNumber, ayahNumber] = current_posStr.split(":").map(Number);

    // Implement the logic to handle the bookmark action (e.g., save to database)
    await Bookmark.addBookmark(User.studentId, User.courseId, surahNumber, ayahNumber);
    res.status(200).send("Bookmark saved successfully");
  } catch (error) {
    console.error("Error handling bookmark:", error);
    res.status(500).send("Internal Server Error");
  }
});

ourApp.post("/removeBookmark", async (req, res) => {
  try {
    const { current_posStr } = req.body;
    let [surahNumber, ayahNumber] = current_posStr.split(":").map(Number);

    // Implement the logic to handle the bookmark action (e.g., save to database)
    await Bookmark.removeBookmark(User.studentId, User.courseId, surahNumber, ayahNumber);
    res.status(200).send("Bookmark saved successfully");
  } catch (error) {
    console.error("Error handling bookmark:", error);
    res.status(500).send("Internal Server Error");
  }
});

ourApp.listen(portNumber, () => {
  console.log(`Server running on http://localhost:${portNumber}`);
});
