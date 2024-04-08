const http = require("http");
const path = require("path");

const app = require(path.join(__dirname, "app"));

const { host, port } = require(path.join(__dirname, "config"));

const server = http.createServer(app);

server.listen(port, host, () => {
	console.log(`Server běží na http://${host}:${port}...`);
});
