import { schemaSimpleMap, getEnumL, proname } from './utils.mjs';

export const schemaTopTemplate = [
  () => `
    import moment from 'moment';
    import * as enums from './Enums';
  `,
];
export const schemaBottomTemplate = [];

// e = {
//   name,
//   extend,
//   group
//   properties = [{
//     name,
//     type,
//     ref,
//     description,
//    }]
// }
export const schemaTemplate = [
  ({ properties }) => {
    const simples = properties
      .filter((item) => item.type !== 'array' || item.ref?.includes('Enum'))
      .map((item) => `'${item.name}'`);
    const complex = properties
      .filter((item) => item.type == 'array' || (item.ref && !item.ref?.includes('Enum')))
      .map((item) => `'${item.name}'`);
    return `
      // simple: [${simples.join(', ')}]
      // complex: [${complex.join(', ')}]`;
  },
  ({ name, properties, extend }) => {
    const listMaps = ['page', 'size', 'total'];
    return `
      export class ${name} ${extend ? 'extends ' + extend : ''}{
        ${properties
          .map((property) => {
            const myProName = proname(property.name);
            let d = schemaSimpleMap[property.type] || 'any';
            let o = ' | undefined = undefined';
            if (property.format === 'date-time') {
              d = 'moment.Moment';
            } else if (property.type === 'array') {
              d = `${getEnumL(property.ref, 'enums.') || schemaSimpleMap[property.items.type]}[]`;
              o = ' = []';
            } else if (property.ref) {
              d = getEnumL(property.ref, 'enums.');
            } else if (name.indexOf('ListObject') > -1 && listMaps.includes(property.name)) {
              d = '';
              o = '= 0';
            }
            const description = property.description?.split('\n')?.join(' ');
            return ` ${description ? `// ${description}\n` : ''} ${myProName}${d ? ':' : ''} ${d}${o}; `;
          })
          .join('\n')}
      }
    `;
  },
];
