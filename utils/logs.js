const fs = require("fs");
const path = require("path");

const logFile = (filename, data) => {
  const dir = path.join(__dirname, `../logs/${filename}.json`);
  const writeData = JSON.stringify(data, null, 4);
  fs.writeFileSync(dir, writeData);
};

logFile("test", {
  test: 1,
  string: "tt",
});

module.exports = logFile;
