import { queryParamTemplate, queryParamTopTemplate, queryParamBottomTemplate } from '../template/index.mjs';

export function getQueryParams(paths, group) {
  function getRef(propertyValue) {
    let ref = '';
    if (propertyValue && propertyValue.items && propertyValue.items.$ref) {
      ref = propertyValue.items.$ref;
    }
    if (propertyValue && propertyValue.oneOf && propertyValue.oneOf.length && propertyValue.oneOf[0].$ref) {
      ref = propertyValue.oneOf[0].$ref;
    }
    return ref.split('#/components/schemas/')[1];
  }

  const temp = [];
  for (let key in paths) {
    const path = paths[key];
    for (let method in path) {
      const parameters = path[method]?.parameters || [];
      if (parameters.filter((parameter) => parameter.in === 'query').length) {
        const queryParams = {
          name: path[method].operationId,
          group,
          parameters: parameters
            .map((item) => ({
              ...item,
              ref: getRef(item.schema),
              isArray: item?.schema?.type === 'array',
              arrayItemType: item?.schema?.items?.type,
            }))
            .filter((item) => item.in === 'query'),
        };
        temp.push(queryParams);
      }
    }
  }
  return temp;
}

export function queryParamHdl(data) {
  let t = '';

  const d = getQueryParams(data.paths, data.urlData.group);
  queryParamTopTemplate.forEach((queryParamTopTemplateItem) => {
    t += queryParamTopTemplateItem(data);
  });
  d.forEach((queryParam) => {
    queryParamTemplate.forEach((queryParamTemplateItem) => {
      t += queryParamTemplateItem(queryParam);
    });
  });
  queryParamBottomTemplate.forEach((queryParamBottomTemplateItem) => {
    t += queryParamBottomTemplateItem(data);
  });
  return t;
}
