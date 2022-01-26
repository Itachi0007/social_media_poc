const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/dbConfig").pool;

// create express app
const app = express();

// parse url encoded objects through middleware
app.use(bodyParser.urlencoded({extended: true}));
// parse json objects
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send("Welcome to the Notes app");
});

// importing the routes
require("./routes")(app);

// select the port
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server started at ${port}...`);
});
