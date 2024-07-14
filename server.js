const express = require("express");
const cors = require("cors");
const ourApp = express();
const Surah = require("./Surah");
const Mistakes = require("./mistakesFormatting");
const Bookmark = require("./bookmarkFormatting");
ourApp.use(express.json());
const AyahInfo = require("./AyahInfo"); // Import the AyahInfo model
const AWS = require('aws-sdk')
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

const PORT_NUMBER = 501;

let User = {
  studentId: null,
  courseId: null
}

AWS.config.update({
  region: 'us-east-2',
  credentials: {
    accessKeyId:'',
    secretAccessKey:''
  }
});

async function authenticateUser(username, password) {
  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: '1f6l25k8h5f4gc3ldo1a7kcb2e',
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    }
  };

  try {
    const data = await cognitoIdentityServiceProvider.initiateAuth(params).promise();
    console.log('User authenticated:', data.AuthenticationResult);
    return data.AuthenticationResult; // Token and other details
  } catch (err) {
    console.error('Authentication error:', err);
    throw err;
  }
}

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



async function getAyahData(studentId, courseId, startPos, endPos) {
  startPos = startPos.split(":").map(Number);
  endPos = endPos.split(":").map(Number);

  console.log(`___________DEBUG 9_________\n |${startPos[0]}:${startPos[1]}| ||| |${endPos}`);

  let current_pos = [...startPos]; // Create a copy to avoid modifying startPos directly
  let promises = [];

  while (current_pos[0] !== endPos[0] || current_pos[1] !== endPos[1] + 1) {
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
          const mistakes = await Mistakes.hasMistake(studentId, courseId, current_posStr);

          console.log("__________DEBUG 8_____________")
          console.log(`${User.studentId}, ${User.courseId}, ${pos[0]}, ${pos[1]}`)

          const isBookmarked = await Bookmark.isBookmarked(
            studentId, courseId, pos[0], pos[1]
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

  return await Promise.all(promises);
}

ourApp.post("/fetchAyahs", async (req, res) => {
  try {
    const { studentId, courseId, startPos, endPos } = req.body;
    User.studentId = studentId;
    User.courseId = courseId;

    if (!startPos || !endPos) {
      return res.status(400).json({ error: "startPos and endPos are required" });
    }

    const ayahData = await getAyahData(studentId, courseId, startPos, endPos);
    res.json(ayahData);
  } catch (err) {
    console.error("Error fetching ayahs:", err);
    res.status(500).json({ error: "Internal Server Error" });
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
    const { studentId, courseId, current_posStr, mistakeIndexes } = req.body;
    let [surahNumber, ayahNumber] = current_posStr.split(":").map(Number);

    // Implement the logic to handle adding mistakes (e.g., save to database)
    await Mistakes.addMistake(studentId, courseId, surahNumber, ayahNumber, mistakeIndexes);
    res.status(200).send("Mistake added successfully");
  } catch (error) {
    console.error("Error adding mistake:", error);
    res.status(500).send("Internal Server Error");
  }
});
ourApp.post("/removeMistake", async (req, res) => {
  try {
    const { studentId, courseId, current_posStr, mistakeIndexes } = req.body;
    let [surahNumber, ayahNumber] = current_posStr.split(":").map(Number);

    // Implement the logic to handle removing mistakes (e.g., update database)
    await Mistakes.removeMistake(studentId, courseId, surahNumber, ayahNumber, mistakeIndexes);
    res.status(200).send("Mistake removed successfully");
  } catch (error) {
    console.error("Error removing mistake:", error);
    res.status(500).send("Internal Server Error");
  }
});

ourApp.listen(PORT_NUMBER, () => {
  console.log(`Server running on http://localhost:${PORT_NUMBER}`);
});
