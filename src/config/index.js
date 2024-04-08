require("dotenv").config();

module.exports = {
	host: process.env.HOSTNAME,
	port: process.env.PORT,
	key: process.env.SECRET,
};