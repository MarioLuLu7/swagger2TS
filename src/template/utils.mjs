import { replace } from '../swaggerData/config.mjs';

export const getEnumL = (ref = '', l) => {
  if (ref.includes('Enum')) {
    return l + ref;
  }
  return ref;
};

export const isEnum = (ref) => {
  if (ref.includes('Enum')) {
    return true;
  }
  return false;
};

export const schemaSimpleMap = {
  integer: 'number',
  number: 'number',
  string: 'string',
  boolean: 'boolean',
};

export const imname = (name) => `models.${name}`;

export const proname = (name) => replace[name] || name;
