const { createReadStream, createWriteStream } = require('fs');
const path = require('path');
const { mkdir, readdir, copyFile, rm } = require('fs').promises;
const distPath = path.join(__dirname, 'project-dist');
const assetsPath = path.join(__dirname, 'assets');
const stylePath = path.join(__dirname, 'styles');

async function createDir() {
  await mkdir(distPath, { recursive: true });
}
createDir();

function copyHtml() {
  try {
    let str = '';
    const templateFileRs = createReadStream(
      path.join(__dirname, 'template.html'),
      'utf-8',
    );
    const indexFileWs = createWriteStream(path.join(distPath, 'index.html'));

    templateFileRs.on('data', async (data) => {
      str = data;
      const components = await readdir(path.join(__dirname, 'components'), {
        withFileTypes: true,
      });
      const newComponents = components.map((component) => {
        const fileName = path.basename(component.name);
        return `{{${fileName.replace('.html', '')}}}`;
      });
      components.forEach((component, index) => {
        const componentFileRs = createReadStream(
          path.join(__dirname, 'components', component.name),
          'utf-8',
        );
        componentFileRs.on('data', (data) => {
          str = str.replace(newComponents[index], data);
          if (!newComponents.some((comp) => str.includes(comp))) {
            indexFileWs.write(str);
          }
        });
      });
    });
  } catch (err) {
    console.log('Ошибка в блоке html:', err);
  }
}
copyHtml();

async function copyStyles() {
  try {
    const styleFileWs = createWriteStream(path.join(distPath, 'style.css'));
    const styles = await readdir(stylePath);
    styles.forEach((style) => {
      const filePath = path.join(path.join(stylePath, style));
      const fileName = path.basename(filePath);
      const fileExt = path.extname(filePath);
      if (fileExt === '.css') {
        const styleFileRs = createReadStream(
          path.join(stylePath, fileName),
          'utf-8',
        );
        styleFileRs.pipe(styleFileWs);
      }
    });
  } catch (err) {
    console.log('Ошибка в блоке стилей:', err);
  }
}
copyStyles();

async function copyAssets() {
  try {
    await mkdir(path.join(distPath, 'assets'), { recursive: true });
    const files = await readdir(assetsPath, {
      recursive: true,
      withFileTypes: true,
    });
    const copyFiles = await readdir(path.join(distPath, 'assets'), {
      recursive: true,
      withFileTypes: true,
    });
    const filesToAdd = files.filter((file) => {
      return !copyFiles.some((copyFile) => {
        return copyFile.name === file.name;
      });
    });
    const filesToDelete = copyFiles.filter((copyFile) => {
      return !files.some((file) => {
        return copyFile.name === file.name;
      });
    });
    filesToDelete.forEach(async (file) => {
      if (file.path === path.join(distPath, 'assets')) {
        await rm(path.join(distPath, 'assets', file.name));
      } else {
        await rm(
          path.join(distPath, 'assets', path.basename(file.path), file.name),
        );
      }
    });
    filesToAdd.forEach(async (file) => {
      if (file.isDirectory()) {
        await mkdir(path.join(path.join(distPath, 'assets', file.name)), {
          recursive: true,
        });
      } else {
        if (file.path === assetsPath) {
          await copyFile(
            path.join(assetsPath, file.name),
            path.join(distPath, 'assets', file.name),
          );
        } else {
          await copyFile(
            path.join(assetsPath, path.basename(file.path), file.name),
            path.join(distPath, 'assets', path.basename(file.path), file.name),
          );
        }
      }
    });
  } catch (err) {
    console.log('Ошибка в блоке assets:', err);
  }
}
copyAssets();
