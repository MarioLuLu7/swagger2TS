import { schemaTemplate, schemaTopTemplate, schemaBottomTemplate } from '../template/index.mjs';

export function getSchemas(schemas, group) {
  function getRef(propertyValue) {
    let ref = '';
    if (propertyValue?.items?.$ref) {
      ref = propertyValue.items.$ref;
    }
    if (propertyValue?.oneOf?.[0].$ref) {
      ref = propertyValue.oneOf[0].$ref;
    }
    if (propertyValue?.$ref) {
      ref = propertyValue.$ref;
    }
    return ref.split('#/components/schemas/')[1];
  }

  const temp = [];
  const notExtends = [];
  for (let name in schemas) {
    if (!name.includes('Enum')) {
      const value = schemas[name].allOf ? schemas[name].allOf[1] : schemas[name];
      const properties = [];
      for (let key in value.properties) {
        const propertyValue = value.properties[key];
        const property = {
          name: key,
          ...propertyValue,
          ref: getRef(propertyValue),
        };
        properties.push(property);
      }
      const schema = {
        name,
        ...value,
        properties,
        extend: getRef(schemas?.[name]?.allOf?.[0] || ''),
        group,
      };
      // extends
      if (schema.extend && !temp.filter((item) => item.name === schema.extend).length) {
        notExtends.push(schema);
      } else {
        temp.push(schema);
        for (let i = notExtends.length - 1; i >= 0; i--) {
          const extendData = notExtends[i];
          if (temp.filter((item) => item.name === extendData.extend).length) {
            temp.push(extendData);
            notExtends.splice(i, 1);
          }
        }
      }
    }
  }
  return temp;
}

export function schemaHdl(data) {
  let t = '';

  const d = getSchemas(data.schemas, data.urlData.group);
  schemaTopTemplate.forEach((schemaTopTemplateItem) => {
    t += schemaTopTemplateItem(data);
  });
  d.forEach((schema) => {
    schemaTemplate.forEach((schemaTemplateItem) => {
      t += schemaTemplateItem(schema);
    });
  });
  schemaBottomTemplate.forEach((schemaBottomTemplateItem) => {
    t += schemaBottomTemplateItem(data);
  });
  return t;
}
