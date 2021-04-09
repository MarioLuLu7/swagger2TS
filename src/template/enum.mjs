export const enumTopTemplate = [
  () => `
    import { Enum, IEnumObj, IEnumKey, IEnumValue } from '@tses3-front/shared';
    const enumMaps = new WeakMap<IEnumObj, Record<IEnumKey<IEnumObj>, string>>();
    export function getEnumShow<T extends IEnumObj>(enumObj: T, enumVal?: IEnumValue<T>) {
      const mapper = enumMaps.get(enumObj);
      if (!mapper || !enumVal) {
        return '';
      }
      return Enum.getEnumMappee(mapper, enumVal);
    }
  `,
];
export const enumBottomTemplate = [];

// e = {
//   name,
//   description,
//   x-enumNames,
//   enum,
//   x-enum-displays
// }
export const enumTemplate = [
  (e) => {
    const name = e.name;
    const enumValue = e.enum;
    const description = e.description?.split('\n')?.join(' ');
    return `
    ${description ? `// ${description}` : ''}
      export enum ${name} {
        ${enumValue.map((enumItem) => `${enumItem} = '${enumItem}',`).join('\n')}
      }
    `;
  },
  (e) => {
    const name = e.name;
    const enumValue = e.enum;
    const enumDisplay = e['x-enum-displays'];
    return `
      export const ${name}Mapper: Record<${name}, string> = {
        ${enumValue
          .map((enumItem, index) => `[${name}.${enumItem}]: '${enumDisplay[index].split('\n').join('')}',`)
          .join('\n')}
      };
    `;
  },
  (e) => {
    const name = e.name;
    return `
      enumMaps.set(${name}, ${name}Mapper);
    `;
  },
];
