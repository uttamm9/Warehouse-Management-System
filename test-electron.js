const path = require('path');
const asarApp = path.join(__dirname, 'dist', 'win-unpacked', 'resources', 'app.asar');
process.resourcesPath = path.join(__dirname, 'dist', 'win-unpacked', 'resources');
try {
  require(path.join(asarApp, 'desktop', 'main.js'));
} catch (e) {
  console.error("FAILED TO LOAD", e);
}
