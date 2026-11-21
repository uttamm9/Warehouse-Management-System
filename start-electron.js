const { spawn } = require('child_process');

const env = { ...process.env };
// Remove the conflicting environment variable that forces Electron to run as Node.js
delete env.ELECTRON_RUN_AS_NODE;

// require('electron') resolves to the binary path because we are currently in a Node context
const electronPath = require('electron'); 

const child = spawn(electronPath, ['.'], {
  env,
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code);
});
