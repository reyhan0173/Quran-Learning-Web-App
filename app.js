let http = require("http");

let ourApp = http.createServer(function (req, res) {
  if (req.url == "/") {
    res.end(`${req.url}`);
  } else {
    res.end(`${req.url} doesnt exist`);
  }
});

ourApp.listen(3000);
