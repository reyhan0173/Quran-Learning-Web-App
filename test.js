let express = require("express");
let ourApp = express();
ourApp.use(express.urlencoded({ extended: false }));

ourApp.get("/", (req, res) => {
  res.send(`
    <form action="/answer" method="POST">
        <p>What color is the sky on a clear sunny day?</p>
        <input name="skyColor" autocomplete="off">
        <button>Submit answer</button>
    </form>
    `);
});

ourApp.post("/answer", (req, res) => {
  if (req.body.skyColor.toUpperCase() == "BLUE") {
    res.send(`
        <p>Congrats, That's a correct answer!</p>
        <a href="/">Back to homepage</a>
    `);
  } else {
    res.send(`
        <p>Sorry, That's a incorrect.</p>
        <a href="/">Back to homepage</a>
    `);
  }
});

ourApp.get("/answer", (req, res) => {
  res.send("Are you lost? There is nothing to see here.");
  res.send(`
  <a href="/">Back to homepage</a>
  `);
});

ourApp.listen(300);
