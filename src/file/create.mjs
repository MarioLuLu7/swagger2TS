import fs from 'fs';

export const createDir = (p) => {
  fs.mkdirSync(p, { recursive: true });
};

export const createFile = (path, fileName, content) => {
  try {
    createDir(path);
    fs.writeFileSync(`${path}/${fileName}`, content);
    console.log(`create success ${path}/${fileName}`);
  } catch (e) {
    console.log(e);
  }
};
