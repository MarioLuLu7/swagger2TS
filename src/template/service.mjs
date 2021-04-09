import { imname, isEnum, proname } from './utils.mjs';

export const serviceTopTemplate = [
  (e) => {
    const group = e.urlData.group;
    return `
      import { Lang } from '@tses3-front/shared';
      import moment from 'moment';
      import * as models from './Models';

      const { convert } = Lang;

      export class ${group}Service {
        static _s = new ${group}Service();
    `;
  },
];
export const serviceBottomTemplate = [
  () => {
    return `
      }
    `;
  },
];

export const serviceTemplate = [
  ({ name, properties, extend, group }) => {
    if (!name.includes('Command')) {
      return '';
    }
    return `
      ${name}ToDto(data: ${imname(name)}): any {
        return {
          ${extend ? `...${group}Service._s.${extend}ToDto(data),` : ''}
          ${properties
            .map((property) => {
              const myProName = proname(property.name);
              let v = `convert(data.${myProName}, (v) => v, undefined)`;
              if (property.format === 'date-time') {
                v = `data.${myProName}?.toJSON()`;
              } else if (property.type === 'array') {
                if (property.ref && !isEnum(property.ref)) {
                  v = `convert(data.${myProName}, (v) => v.map((item) => ${group}Service._s.${property.ref}ToDto(item)), [])`;
                } else {
                  v = `convert(data.${myProName}, (v) => v, [])`;
                }
              } else if (property.ref) {
                if (isEnum(property.ref)) {
                  v = `data.${myProName}`;
                } else {
                  v = `convert(data.${myProName}, (v) => ${group}Service._s.${property.ref}ToDto(v), undefined)`;
                }
              }
              return `${property.name}: ${v},`;
            })
            .join('\n')}
        };
      }
    `;
  },
  ({ name, properties, extend, group }) => {
    if (!name.includes('Result')) {
      return '';
    }
    return `
      ${name}FromDto(data: any): ${imname(name)} {
        return Lang.assign(new ${imname(name)}(), {
          ${extend ? `...${group}Service._s.${extend}FromDto(data),` : ''}
          ${properties
            .map((property) => {
              const myProName = property.name;
              let v = `convert(data.${myProName}, (v) => v, undefined)`;
              if (property.format === 'date-time') {
                v = `convert(data.${myProName}, (v) => moment(v), undefined)`;
              } else if (property.type === 'array') {
                if (property.ref) {
                  v = `convert(data.${myProName}, (v) => v.map((item) => ${group}Service._s.${property.ref}FromDto(item)), [])`;
                } else {
                  v = `convert(data.${myProName}, (v) => v, [])`;
                }
              } else if (property.ref) {
                if (isEnum(property.ref)) {
                  v = `data.${myProName}`;
                } else {
                  v = `convert(data.${myProName}, (v) => ${group}Service._s.${property.ref}FromDto(v), undefined)`;
                }
              }
              return `${proname(myProName)}: ${v},`;
            })
            .join('\n')}
        });
      }
    `;
  },
];
