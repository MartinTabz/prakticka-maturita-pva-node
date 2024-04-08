const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.get(["/", "/index"], (dotaz, odpoved) => {
	return odpoved.render("index");
});

module.exports = app;