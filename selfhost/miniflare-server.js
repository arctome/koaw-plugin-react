const process = require('process')
const { Miniflare } = require("miniflare");
const port = process.env.PORT || 8000

const mf = new Miniflare({
  scriptPath: "./dist/main.js",
});
mf.createServer().listen(port, () => {
  console.log("Listening on :" + port);
});