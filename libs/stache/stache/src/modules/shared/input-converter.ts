import {} from 'reflect-metadata';

// Inspiration for this script was taken from:
// https://blog.rsuter.com/
//  angular-2-typescript-property-decorator-that-converts-input-values-to-the-correct-type/

export const stringConverter = (value: any) => {
  if (value === undefined || typeof value === 'string') {
    return value;
  }

  return value.toString();
};

export const booleanConverter = (value: any) => {
  if (value === undefined || typeof value === 'boolean') {
    return value;
  }

  return value.toString() === 'true';
};

export const numberConverter = (value: any) => {
  if (value === undefined || typeof value === 'number') {
    return value;
  }

  return parseFloat(value.toString());
};

const getMetaData = (target: Object, key: string) => {
  return Reflect.getMetadata('design:type', target, key);
};

export function InputConverter(converter?: (value: any) => any) {
  return (target: Object, key: string) => {
    if (converter === undefined) {
      let metadata = getMetaData(target, key);

      if (!metadata) {
        throw new Error('The reflection metadata could not be found.');
      }

      if (metadata.name === 'String') {
        converter = stringConverter;
      } else if (metadata.name === 'Boolean') {
        converter = booleanConverter;
      } else if (metadata.name === 'Number') {
        converter = numberConverter;
      } else {
        throw new Error(`There is no converter for the given property type ${metadata.name}.`);
      }
    }

    Object.defineProperty(target, key, {
      get: function () {
        return this['__' + key];
      },
      set: function (value) {
        this['__' + key] = converter(value);
      },
      enumerable: true,
      configurable: true
    });
  };
}
