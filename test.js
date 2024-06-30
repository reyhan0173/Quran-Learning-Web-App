const express = require("express");
const cors = require("cors");
const ourApp = express();
const Surah = require("./Surah");
const Mistakes = require("./mistakesFormatting");
const Bookmark = require("./bookmarkFormatting");
ourApp.use(express.json());
const AyahInfo = require("./AyahInfo"); // Import the AyahInfo model

const portNumber = 501;

const User = {
  studentId: 1111115,
  courseId: 123,
};

// Serve static files from the 'public' directory
ourApp.use(express.urlencoded({ extended: false }));
ourApp.use(express.static("public"));
ourApp.use(cors())
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

async function fetchVerse(surahNumber, ayahNumber) {
  try {
    const result = await AyahInfo.findOne({
      where: { surahNumber: surahNumber, ayahNumber: ayahNumber },
      attributes: ["ayahText"],
    });
    return result ? result.ayahText : null;
  } catch (err) {
    console.error(err);
    return null; // Return null in case of error
  }
}



async function getAyahData(start_pos, end_pos) {
  start_pos = start_pos.split(":").map(Number);
  end_pos = end_pos.split(":").map(Number);

  console.log(`___________DEBUG 9_________\n |${start_pos[0]}:${start_pos[1]}| ||| |${end_pos}`);

  let current_pos = [...start_pos]; // Create a copy to avoid modifying start_pos directly
  let promises = [];

  while (current_pos[0] !== end_pos[0] || current_pos[1] !== end_pos[1] + 1) {
    console.log(`i=====${JSON.stringify(current_pos)}`);
    if (current_pos[1] > (await getAyahCount(current_pos[0]))) {
      current_pos[0] += 1;
      current_pos[1] = 1;
    } else {
      let current_posStr = `${current_pos[0]}:${current_pos[1]}`;

      // Wrap the async operation in a function to control when current_pos[1] is incremented
      const fetchAyah = async (pos) => {
        try {
          console.log(`i1=====${JSON.stringify(pos)}`);
          const verse = await fetchVerse(pos[0], pos[1]);
          const mistakes = await Mistakes.hasMistake(current_posStr);

          console.log("__________DEBUG 8_____________")
          console.log(`${User.studentId}, ${User.courseId}, ${pos[0]}, ${pos[1]}`)

          const isBookmarked = await Bookmark.isBookmarked(
              User.studentId,
              User.courseId,
              pos[0],
              pos[1]
          );

          console.log(`isBookmarked?>: ${isBookmarked}`);

          return {
            current_posStr,
            verse,
            mistakes,
            isBookmarked
          };
        } catch (error) {
          console.error("Error fetching ayah:", error);
          return null; // Handle errors gracefully
        }
      };

      // Push the promise to the promises array and await its resolution
      promises.push(fetchAyah([...current_pos])); // Pass a copy of current_pos to avoid reference issues

      // Increment current_pos[1] after pushing the promise
      current_pos[1] += 1;
    }
  }

  const ayahsData = await Promise.all(promises);
  return ayahsData;
}

ourApp.post("/fetchAyahs", async (req, res) => {
  try {
    console.log("POST /fetchAyahs called"); // Correct log statement for POST request

    const { start_pos, end_pos } = req.body;

    // Check if start_pos and end_pos are defined
    if (start_pos === undefined || end_pos === undefined) {
      console.error("Error: start_pos or end_pos is not defined");
      return res.status(400).json({ error: "start_pos and end_pos are required" });
    }

    console.log(`Received start_pos: ${start_pos}, end_pos: ${end_pos}`);

    const ayahData = await getAyahData(start_pos, end_pos);

    console.log("Ayah data fetched successfully", ayahData);

    res.json(ayahData); // Respond with JSON data
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ error: "Internal Server Error" }); // Respond with JSON error message
  }
});

ourApp.post("/checkBookmark", async (req, res) => {
  try {
    const [surahId, ayahId] = req.body.current_posStr.split(":").map(Number);
    const isBookmarked = await Bookmark.isBookmarked(User.studentId, User.courseId, surahId, ayahId);
    console.log(`________DEBUG 10________\n isBookmarked: ${isBookmarked}`);
    res.status(200).send({ isBookmarked });
  } catch (error) {
    console.error("Error checking bookmark state:", error);
    res.status(500).send({ error: "Failed to check bookmark state" });
  }
});

ourApp.post("/addBookmark", async (req, res) => {
  console.log(`Trying to add bookmark at ${req.body}`);
  try {
    const { current_posStr } = req.body;

    if (!current_posStr || typeof current_posStr !== 'string') {
      throw new Error("Invalid current_posStr format");
    }

    const [surahNumber, ayahNumber] = current_posStr.split(":").map(Number);

    if (isNaN(surahNumber) || isNaN(ayahNumber)) {
      throw new Error("Invalid surahNumber or ayahNumber");
    }

    // Assume User.studentId and User.courseId are securely obtained from authentication
    console.log("_____________________DEBUG________________________");
    console.log(User.studentId, User.courseId, surahNumber, ayahNumber);
    await Bookmark.addBookmark(User.studentId, User.courseId, surahNumber, ayahNumber);

    res.status(200).send("Bookmark added successfully");
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).send("Failed to add bookmark");
  }
});

ourApp.post("/removeBookmark", async (req, res) => {
  console.log(`Trying to Remove bookmark at ${req.body}`);
  try {
    const { current_posStr } = req.body;

    if (!current_posStr || typeof current_posStr !== 'string') {
      throw new Error("Invalid current_posStr format");
    }

    const [surahNumber, ayahNumber] = current_posStr.split(":").map(Number);

    if (isNaN(surahNumber) || isNaN(ayahNumber)) {
      throw new Error("Invalid surahNumber or ayahNumber");
    }

    // Assume User.studentId and User.courseId are securely obtained from authentication
    console.log("_____________________DEBUG________________________");
    console.log(User.studentId, User.courseId, surahNumber, ayahNumber);

    await Bookmark.removeBookmark(User.studentId, User.courseId, surahNumber, ayahNumber);

    res.status(200).send("Bookmark removed successfully");
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).send("Failed to remove bookmark");
  }
});

ourApp.post("/addMistake", async (req, res) => {
  try {
    const { current_posStr, mistakeIndexes } = req.body;
    let [surahNumber, ayahNumber] = current_posStr.split(":").map(Number);

    // Implement the logic to handle adding mistakes (e.g., save to database)
    await Mistakes.addMistake(surahNumber, ayahNumber, mistakeIndexes);
    res.status(200).send("Mistake added successfully");
  } catch (error) {
    console.error("Error adding mistake:", error);
    res.status(500).send("Internal Server Error");
  }
});
ourApp.post("/removeMistake", async (req, res) => {
  try {
    const { current_posStr, mistakeIndexes } = req.body;
    let [surahNumber, ayahNumber] = current_posStr.split(":").map(Number);

    // Implement the logic to handle removing mistakes (e.g., update database)
    await Mistakes.removeMistake(surahNumber, ayahNumber, mistakeIndexes);
    res.status(200).send("Mistake removed successfully");
  } catch (error) {
    console.error("Error removing mistake:", error);
    res.status(500).send("Internal Server Error");
  }
});

ourApp.listen(portNumber, () => {
  console.log(`Server running on http://localhost:${portNumber}`);
});
