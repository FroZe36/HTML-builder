const path = require('path');
const fs = require('fs');
const readline = require('readline');
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '',
});
const ws = fs.createWriteStream(path.join(__dirname, 'text.txt'));
rl.output.write('How Are You?\n');
rl.on('line', (line) => {
  if (line.trim() === 'exit') {
    rl.close();
  }
  ws.write(line + '\n');
});
rl.on('close', () => {
  console.log('Good Bye!');
  process.exit();
});
