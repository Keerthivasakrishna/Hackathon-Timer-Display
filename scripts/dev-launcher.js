import { spawn, exec } from 'child_process';

console.log('\n🚀 Starting HACKATRONICS 2nd Edition Dev Server...\n');

// Start Vite server
const vite = spawn('npx', ['vite', '--port', '5173'], {
  stdio: 'inherit',
  shell: true
});

// Wait 1.2 seconds for Vite server to initialize, then launch both URLs in browser
setTimeout(() => {
  console.log('\n🌐 Opening Auditorium Display & Organizer Control Panel in browser...\n');

  const displayUrl = 'http://localhost:5173/';
  const controlUrl = 'http://localhost:5173/?view=control';

  if (process.platform === 'win32') {
    exec(`start "" "${displayUrl}"`);
    setTimeout(() => {
      exec(`start "" "${controlUrl}"`);
    }, 500);
  } else if (process.platform === 'darwin') {
    exec(`open "${displayUrl}"`);
    setTimeout(() => {
      exec(`open "${controlUrl}"`);
    }, 500);
  } else {
    exec(`xdg-open "${displayUrl}"`);
    setTimeout(() => {
      exec(`xdg-open "${controlUrl}"`);
    }, 500);
  }
}, 1200);
