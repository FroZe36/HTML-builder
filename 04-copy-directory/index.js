const path = require('path');
const { copyFile, mkdir, readdir, rm, readFile, writeFile } =
  require('fs').promises;

async function copyDir() {
  try {
    const projectFolder = path.join(__dirname, 'files-copy');
    await mkdir(projectFolder, {
      recursive: true,
    });
    const files = await readdir(path.join(__dirname, 'files'));
    const copyFiles = await readdir(path.join(projectFolder));
    files.forEach(async (file) => {
      const pathFilePath = path.join(__dirname, 'files', file);
      const copyFilePath = path.join(projectFolder, file);

      const fileContent = await readFile(pathFilePath, 'utf-8');
      const copyFileContent = await readFile(copyFilePath, 'utf-8');

      if (copyFileContent !== fileContent) {
        await writeFile(copyFilePath, fileContent);
      }
    });
    const filesToDelete = copyFiles.filter((file) => !files.includes(file));
    filesToDelete.forEach((file) => {
      rm(path.join(__dirname, 'files-copy', file));
    });
    files.forEach((file) => {
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
