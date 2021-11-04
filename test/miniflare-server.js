const { Miniflare } = require("miniflare");

const mf = new Miniflare({
  scriptPath: "./dist/main.js",
});
mf.createServer().listen(10081, () => {
  console.log("Listening on :10081");
});