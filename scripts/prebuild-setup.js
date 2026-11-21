const fs = require("fs");
const path = require("path");

const enginesPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@prisma",
  "engines"
);

const possibleEngines = [
  "libquery_engine-windows.dll.node",
  "query_engine-windows.dll.node"
];

const engineExists = possibleEngines.some(file =>
  fs.existsSync(path.join(enginesPath, file))
);

if (!engineExists) {
  console.warn("Prisma engine not found (warning only)");
}