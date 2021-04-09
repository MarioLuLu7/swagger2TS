import { enumTemplate, enumTopTemplate, enumBottomTemplate } from '../template/index.mjs';

function getEnums(schemas) {
  const temp = [];
  for (let name in schemas) {
    if (name.includes('Enum')) {
      const value = schemas[name];
      const enumt = {
        name,
        ...value,
      };
      temp.push(enumt);
    }
  }
  return temp;
}

export function enumHdl(data) {
  let t = '';

  const d = getEnums(data.schemas);
  enumTopTemplate.forEach((enumTopTemplateItem) => {
    t += enumTopTemplateItem(data);
  });
  d.forEach((enumt) => {
    enumTemplate.forEach((enumTemplateItem) => {
      t += enumTemplateItem(enumt);
    });
  });
  enumBottomTemplate.forEach((enumBottomTemplateItem) => {
    t += enumBottomTemplateItem(data);
  });
  return t;
}
