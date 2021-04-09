import { schemaSimpleMap, getEnumL } from './utils.mjs';

export const queryParamTopTemplate = [
  () => `
    import * as enums from './Enums';
  `,
];
export const queryParamBottomTemplate = [];

// e = {
//   name,
//   group,
//   parameters = [{
//     name,
//     in,
//     description,
//     ref,
//     isArray,
//     arrayItemType,
//     schema = {
//       type,
//     }
//   }]
// }
export const queryParamTemplate = [
  (e) => {
    const name = e.name;
    const parameters = e.parameters;
    return `
      export class ${name}_QueryParams {
        ${parameters
          .map((queryParamItem) => {
            const type = queryParamItem.schema.type;
            let t = `${schemaSimpleMap[type]} | undefined = undefined`;
            if (type === 'array') {
              if (queryParamItem.ref) {
                t = `${getEnumL(queryParamItem.ref, 'enums.')}[] = []`;
              } else {
                t = `${schemaSimpleMap[queryParamItem.schema.items.type]}[] = []`;
              }
            } else if (queryParamItem.ref) {
              t = `${getEnumL(queryParamItem.ref, 'enums.')} | undefined = undefined`;
            }
            const description = queryParamItem.description?.split('\n')?.join(' ');
            return `${description ? `// ${description}\n` : ''}${queryParamItem.name}: ${t};`;
          })
          .join('\n')}
      }
    `;
  },
];
