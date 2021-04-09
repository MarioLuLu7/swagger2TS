import { apiTemplate, apiTopTemplate, apiBottomTemplate } from '../template/index.mjs';

export function getApis(paths, group) {
  function getRef(requestBody) {
    const schema = requestBody?.content?.['application/json']?.schema;
    return {
      ref: schema?.$ref?.split('#/components/schemas/')?.[1],
      type: schema?.type,
    };
  }

  const temp = [];
  for (let key in paths) {
    const path = paths[key];
    for (let method in path) {
      const api = path[method];
      const apiTemp = {
        ...api,
        method,
        path: key,
        body: getRef(api?.requestBody),
        res: getRef(api?.responses?.['200']),
        group,
      };
      temp.push(apiTemp);
    }
  }
  return temp;
}

export function apiHdl(data) {
  let t = '';

  const d = getApis(data.paths, data.urlData.group);
  apiTopTemplate.forEach((apiTopTemplateItem) => {
    t += apiTopTemplateItem(data);
  });
  d.forEach((api) => {
    apiTemplate.forEach((apiTemplateItem) => {
      t += apiTemplateItem(api);
    });
  });
  apiBottomTemplate.forEach((apiBottomTemplateItem) => {
    t += apiBottomTemplateItem(data);
  });
  return t;
}
