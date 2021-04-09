import { serviceTemplate, serviceTopTemplate, serviceBottomTemplate } from '../template/index.mjs';
import { getSchemas } from './schema.mjs';

export function serviceHdl(data) {
  let t = '';

  const d = getSchemas(data.schemas, data.urlData.group);
  serviceTopTemplate.forEach((serviceTopTemplateItem) => {
    t += serviceTopTemplateItem(data);
  });
  d.forEach((schema) => {
    serviceTemplate.forEach((serviceTemplateItem) => {
      t += serviceTemplateItem(schema);
    });
  });
  serviceBottomTemplate.forEach((serviceBottomTemplateItem) => {
    t += serviceBottomTemplateItem(data);
  });
  return t;
}
