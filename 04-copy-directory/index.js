const path = require('path');
const { copyFile, mkdir, readdir, rm } = require('fs').promises;

async function copyDir() {
  try {
    const projectFolder = path.join(__dirname, 'files-copy');
    await mkdir(projectFolder, {
      recursive: true,
    });
    const files = await readdir(path.join(__dirname, 'files'));
    const copyFiles = await readdir(path.join(projectFolder));
    const filesToAdd = files.filter((file) => !copyFiles.includes(file));
    const filesToDelete = copyFiles.filter((file) => !files.includes(file));
    filesToDelete.forEach((file) => {
      rm(path.join(__dirname, 'files-copy', file));
    });
    filesToAdd.forEach((file) => {
      copyFile(
        path.join(__dirname, 'files', file),
        path.join(__dirname, 'files-copy', file),
      );
    });
  } catch (err) {
    console.log(err);
  }
}
copyDir();
