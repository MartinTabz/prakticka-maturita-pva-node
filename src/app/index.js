const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const jsondb = require("simple-json-db");
const { v4: uuidv4 } = require("uuid");

const app = express();

const { key } = require(path.join(__dirname, "..", "config"));

app.use(
	session({
		secret: key,
		secure: false,
		resave: false,
		saveUninitialized: false,
		cookie: { sameSite: "strict" },
	})
);

const db = new jsondb(
	path.join(__dirname, "..", "..", "data", "uzivatele.json")
);

const notesDb = new jsondb(
	path.join(__dirname, "..", "..", "data", "poznamky.json")
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.get(["/", "/index"], (dotaz, odpoved) => {
	return odpoved.render("index");
});

app.get("/registrace", (dotaz, odpoved) => {
	return odpoved.render("registrace");
});

app.post("/registrovat", (dotaz, odpoved) => {
	let jmeno = dotaz.body.jmeno;
	let heslo = dotaz.body.heslo;

	if (db.has(jmeno)) {
		return odpoved.json({
			uspech: false,
			hlaseni: "Uživatel již existuje!",
		});
	}

	db.set(jmeno, {
		heslo: bcrypt.hashSync(heslo, 10),
		cas_registrace: new Date(),
	});

	return odpoved.json({
		uspech: true,
		hlaseni: "OK",
	});
});

app.get("/prihlaseni", (dotaz, odpoved) => {
	return odpoved.render("prihlaseni");
});

app.post("/prihlasit", (dotaz, odpoved) => {
	let jmeno = dotaz.body.jmeno;
	let heslo = dotaz.body.heslo;

	if (!db.has(jmeno)) {
		return odpoved.json({
			uspech: false,
			hlaseni: "Uživatel neexistuje!",
		});
	}

	let uzivatel = db.get(jmeno);

	if (!bcrypt.compareSync(heslo, uzivatel.heslo)) {
		return odpoved.json({
			uspech: false,
			hlaseni: "Chybné heslo!",
		});
	}

	dotaz.session.uzivatel = jmeno;

	return odpoved.json({
		uspech: true,
		hlaseni: "OK",
	});
});

app.get("/profil", (dotaz, odpoved) => {
	if (!dotaz.session.uzivatel) {
		return odpoved.redirect("/prihlaseni");
	}

	return odpoved.render("profil", {
		uzivatel: dotaz.session.uzivatel,
	});
});

app.get("/odhlasit", (dotaz, odpoved) => {
	dotaz.session.destroy();

	return odpoved.json({
		uspech: true,
	});
});

app.get("/poznamky", (dotaz, odpoved) => {
	if (!dotaz.session.uzivatel) {
		return odpoved.redirect("/prihlaseni");
	}

	const vsechnyPoznamky = notesDb.JSON();
	const poznamkyUzivatele = Object.values(vsechnyPoznamky).filter(
		(poznamka) => poznamka.uzivatel === dotaz.session.uzivatel
	);

	return odpoved.render("poznamky", {
		uzivatel: dotaz.session.uzivatel,
		poznamky: poznamkyUzivatele,
	});
});

app.post("/poznamky", (dotaz, odpoved) => {
	if (!dotaz.session.uzivatel) {
		return odpoved.json({
			uspech: false,
			hlaseni: "Není přihlášený uživatel!",
		});
	}

	let nadpis = dotaz.body.nadpis;
	let text = dotaz.body.text;
	let dulezite = dotaz.body.dulezite;

	if (!nadpis) {
		return odpoved.json({
			uspech: false,
			hlaseni: "Chybí nadpis",
		});
	}

	const id = uuidv4();

	notesDb.set(id, {
		id: id,
		nadpis: nadpis,
		text: text || "",
		vytvoreno: new Date(),
		dulezite: dulezite,
		uzivatel: dotaz.session.uzivatel,
	});

	return odpoved.json({
		uspech: true,
		hlaseni: "OK",
	});
});

module.exports = app;
