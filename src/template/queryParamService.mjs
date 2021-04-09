export const queryParamServiceTopTemplate = [
  (e) => {
    const group = e.urlData.group;
    return `
      import { Lang } from '@tses3-front/shared';
      import * as queryParams from './QueryParams';

      const { convert } = Lang;

      export class ${group}QueryParamService {
        static _s = new ${group}QueryParamService();
    `;
  },
];
export const queryParamServiceBottomTemplate = [
  () => {
    return `
      }
    `;
  },
];

export const queryParamServiceTemplate = [
  ({ name, parameters, group }) => {
    return `
      ${name}_QueryParamsToDto(data: queryParams.${name}_QueryParams): any {
        return {
          ${parameters
            .map((property) => {
              const proname = property.name;
              let v = `convert(data?.${proname}, (v) => v, undefined)`;
              if (property.format === 'date-time') {
                v = `data?.${proname}?.toJSON()`;
              } else if (property.isArray) {
                v = `convert(data?.${proname}, (v) => v.map((item) => item), undefined)`;
              }
              return `${proname}: ${v},`;
            })
            .join('\n')}
        };
      }
    `;
  },
];
