const path = require('path');
const { readdir, stat } = require('fs').promises;

async function readSecretFolder() {
  try {
    const files = await readdir(path.join(__dirname, 'secret-folder'), {
      withFileTypes: true,
    });
    files.forEach(async (file) => {
      if (!file.isDirectory()) {
        const filePath = path.join(__dirname, 'secret-folder', file.name);
        const fileName = path.basename(filePath);
        const fileExt = path.extname(filePath);
        const res = await stat(filePath);
        console.log(
          `${fileName.replace(fileExt, '')} - ${fileExt.replace('.', '')} - ${
            res.size
          }байт`,
        );
      }
    });
  } catch (err) {
    console.error(err);
  }
}

readSecretFolder();
