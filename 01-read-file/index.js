const path = require('path');
const fs = require('fs');
const rs = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
rs.on('data', (data) => console.log(data));
