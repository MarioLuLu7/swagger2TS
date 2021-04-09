import { getData } from './swaggerData/get.mjs';
import { schemaHdl, enumHdl, serviceHdl, queryParamHdl, queryParamServiceHdl, apiHdl } from './hdls/index.mjs';
import { createFile, copyFolder, deleteFolder, createDir } from './file/index.mjs';
import { dirname } from './utils/index.mjs';
import path from 'path';
import prettierTslint from 'prettier-tslint';

const __dirname = dirname(import.meta.url);
const distPath = path.resolve(__dirname, '../dist');
const bascPath = path.resolve(__dirname, '../dist/auto');
const copyPath = path.resolve(__dirname, './copyFold');

const nocheck = `// @ts-nocheck\n`;

function createMyFile(path, fileName, content) {
  const code = `${nocheck}${content}`;
  createFile(path, fileName, code);
  prettierTslint.fix(`${path}/${fileName}`);
}

async function main() {
  const datas = await getData();
  const fdMap = {};
  datas.forEach((data) => {
    const group = data.urlData.group;
    if (fdMap[group]) {
      Object.assign(fdMap[group].paths, data.paths);
      Object.assign(fdMap[group].schemas, data.schemas);
    } else {
      fdMap[group] = data;
    }
  });
  let autoT = '';
  for (let group in fdMap) {
    autoT += `export * as ${group} from './${group}';\n`;
    const data = fdMap[group];
    const enumT = enumHdl(data);
    const schemaT = schemaHdl(data);
    const serviceT = serviceHdl(data);
    const queryParamT = queryParamHdl(data);
    const queryParamServiceT = queryParamServiceHdl(data);
    const apiT = apiHdl(data);
    createMyFile(`${bascPath}/${group}`, 'Enums.ts', enumT);
    createMyFile(`${bascPath}/${group}`, 'Models.ts', schemaT);
    createMyFile(`${bascPath}/${group}`, 'Services.ts', serviceT);
    createMyFile(`${bascPath}/${group}`, 'QueryParams.ts', queryParamT);
    createMyFile(`${bascPath}/${group}`, 'QueryParamServices.ts', queryParamServiceT);
    createMyFile(`${bascPath}/${group}`, 'Apis.ts', apiT);
    createMyFile(
      `${bascPath}/${group}`,
      'index.ts',
      `
      export * from './Enums';
      export * from './Models';
      export * from './Services';
      export * from './QueryParams';
      export * from './QueryParamServices';
      export * from './Apis';
    `
    );
  }
  createMyFile(bascPath, 'index.ts', autoT);
  createMyFile(distPath, 'index.ts', `export * from './auto';`);
}

{
  deleteFolder(bascPath);
  createDir(bascPath);
  main();
  copyFolder(copyPath, bascPath);
}
