const path = require('path');
const { createReadStream, createWriteStream, writeFile } = require('fs');
const { readdir } = require('fs').promises;
writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', (err) => {
  if (err) console.log(err);
});
const ws = createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);

async function getBundle() {
  try {
    const styles = await readdir(path.join(__dirname, 'styles'));
    styles.forEach((style) => {
      const filePath = path.join(path.join(__dirname, 'styles', style));
      const fileName = path.basename(filePath);
      const fileExt = path.extname(filePath);
      if (fileExt === '.css') {
        const rs = createReadStream(
          path.join(__dirname, 'styles', fileName),
          'utf-8',
        );
        rs.pipe(ws);
      }
    });
  } catch (err) {
    console.log(err);
  }
}
getBundle();
