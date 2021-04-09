import {
  queryParamServiceTemplate,
  queryParamServiceTopTemplate,
  queryParamServiceBottomTemplate,
} from '../template/index.mjs';
import { getQueryParams } from './queryParam.mjs';

export function queryParamServiceHdl(data) {
  let t = '';

  const d = getQueryParams(data.paths, data.urlData.group);
  queryParamServiceTopTemplate.forEach((queryParamServiceTopTemplateItem) => {
    t += queryParamServiceTopTemplateItem(data);
  });
  d.forEach((schema) => {
    queryParamServiceTemplate.forEach((queryParamServiceTemplateItem) => {
      t += queryParamServiceTemplateItem(schema);
    });
  });
  queryParamServiceBottomTemplate.forEach((queryParamServiceBottomTemplateItem) => {
    t += queryParamServiceBottomTemplateItem(data);
  });
  return t;
}
