const glob = require("glob");
const path = require("path");

module.exports = glob
  .sync(path.join(path.resolve(__dirname), "*.js"))
  .reduce((fetchers, file) => {
    const filename = path.basename(file);

    if (filename !== "index.js" && !filename.startsWith("~")) {
      fetchers[filename.replace(/\.js$/, "")] = require(path.resolve(file));
    }

    return fetchers;
  }, {});
