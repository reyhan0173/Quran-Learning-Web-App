const PORT_NUMBER = 501;

require('dotenv').config();

const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser')
const cors = require("cors");
const AWS = require('aws-sdk')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const Surah = require("./Surah");
const Mistakes = require("./mistakesFormatting");
const Bookmark = require("./bookmarkFormatting");
const AyahInfo = require("./AyahInfo"); // Import the AyahInfo model
const authorizeRoles = require("./authorizeRoles");

const ourApp = express();

// Serve static files from the 'public' directory
ourApp.use(express.json());
ourApp.use(express.urlencoded({ extended: false }));
ourApp.use(express.static("public"));
ourApp.use(bodyParser.json());
ourApp.use(cookieParser('lol'));

const test = "hello"

const JWT_SECRET = 'sample';

ourApp.use(cors({
  origin: 'http://localhost:3000', // Update this to your frontend's URL
  credentials: true // Allow credentials (cookies) to be sent
}));

ourApp.set("view engine", "ejs"); // Set EJS as the template engine

AWS.config.update({
  region: 'us-east-2',
  credentials: {
    accessKeyId:'',
    secretAccessKey:''
  }
});

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

let User = {
  studentId: null,
  courseId: null
}

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

async function AuthUser(username, password) {
  const authParams = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: '1f6l25k8h5f4gc3ldo1a7kcb2e',
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    }
  };

  const groupParams = {
    UserPoolId: 'us-east-2_2Y9XxyYFs',
    Username: username,
  };

  try {
    // Authenticate user
    const authData = await cognitoIdentityServiceProvider.initiateAuth(authParams).promise();
    console.log('User authenticated:', authData.AuthenticationResult);

    // Get user group (role)
    const groupData = await cognitoIdentityServiceProvider.adminListGroupsForUser(groupParams).promise();
    const group = groupData.Groups.map(group => group.GroupName);

    return {
      accessToken: authData.AuthenticationResult.AccessToken,
      idToken: authData.AuthenticationResult.IdToken,
      refreshToken: authData.AuthenticationResult.RefreshToken,
      role: group[0]  // Include the user's role in the response
    };
  } catch (err) {
    console.error('Authentication and group retrieval error:', err);
    throw err;
  }
}

// Login endpoint
ourApp.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const data = await AuthUser(username, password); // Function to authenticate with Cognito

    const { accessToken, refreshToken, idToken, role } = data;

    // Sign JWT for access token (optional if you want a signed token)
    const tokenPayload = { accessToken, role };
    const signedAccessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

    // Set cookies for session management (HTTP-only and secure in production)
    res.cookie('authToken', signedAccessToken, {
      httpOnly: true,
      secure: false, // Secure in production
      path: '/',
      maxAge: 3600000 // 1 hour
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // Secure in production
      path: '/',
      maxAge: 7 * 24 * 3600000 // 1 week (or longer)
    });

    // Set cookies for session management (HTTP-only and secure in production)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false, // Secure in production
      path: '/',
      maxAge: 3600000 // 1 hour
    });

    // Respond with success
    res.json({ message: 'Login successful', role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Logout endpoint
ourApp.post("/logout", async (req, res) => {
  try {
    // Retrieve access token from cookies
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(400).json({ error: 'No access token found' });
    }

    // Perform global sign out with Cognito
    const params = {
      AccessToken: accessToken
    };

    try {
      await cognitoIdentityServiceProvider.globalSignOut(params).promise();
      console.log('Global sign-out successful');
    } catch (error) {
      console.error('Error during global sign-out:', error);
      return res.status(500).json({ error: 'Global sign-out failed' });
    }

    // Clear cookies
    res.clearCookie('authToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    res.clearCookie('accessToken', { path: '/' });

    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Middleware to check authentication status
ourApp.get('/check-auth-status', (req, res) => {
  // Get token from cookies
  const token = req.cookies.authToken;

  // If no token found, return not authenticated
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, 'test');

    // If token is valid, send back the user's role (or other user info)
    return res.json({ role: decoded.role });
  } catch (err) {
    // If token is invalid, return 401 Unauthorized
    return res.status(401).json({ message: 'Invalid token' });
  }
});

ourApp.post("/signup", async (req, res) => {
  const { firstName, lastName, phoneNumber, email, dateOfBirth, username, password } = req.body;

  const signUpParams = {
    ClientId: '1f6l25k8h5f4gc3ldo1a7kcb2e',
    Username: username,
    Password: password,
    UserAttributes: [
      { Name: 'given_name', Value: firstName },
      { Name: 'family_name', Value: lastName },
      { Name: 'phone_number', Value: phoneNumber },
      { Name: 'email', Value: email },
      { Name: 'birthdate', Value: dateOfBirth }
    ]
  };

  try {
    const data = await cognitoIdentityServiceProvider.signUp(signUpParams).promise();
    console.log('Sign up success:', data);
    res.status(200).send('Sign up successful! Please check your email for verification.');
  } catch (err) {
    console.error('Sign up error:', err);
    res.status(500).send('Sign up error: ' + err.message);
  }
});

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

    // Extract the token from the request header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token and extract the payload
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Replace process.env.JWT_SECRET with your actual secret

    // Check if the user's role is "Teachers"
    if (decodedToken.role !== 'Teachers') {
      return res.status(403).send("Access Denied: You do not have the required permissions to perform this action.");
    }

    let [surahNumber, ayahNumber] = current_posStr.split(":").map(Number);

    // Implement the logic to handle removing mistakes (e.g., update database)
    await Mistakes.removeMistake(studentId, courseId, surahNumber, ayahNumber, mistakeIndexes);
    res.status(200).send("Mistake removed successfully");
  } catch (error) {
    console.error("Error removing mistake:", error);
    res.status(500).send("Internal Server Error");
  }
});

ourApp.get("/test", authorizeRoles('Teachers'), (req, res) => {
  res.json({ message: 'this is a test only teachers should see' });
  console.log("this works")
})

ourApp.listen(PORT_NUMBER, () => {
  console.log(`Server running on http://localhost:${PORT_NUMBER}`);
});
