const stringConverter = (value: any) => {
  if (value === undefined || typeof value === 'string') {
    return value;
  }

  return value.toString();
};

const booleanConverter = (value: any) => {
  if (value === undefined || typeof value === 'boolean') {
    return value;
  }

  return value.toString() === 'true';
};

const numberConverter = (value: any) => {
  if (value === undefined || typeof value === 'number') {
    return value;
  }

  return parseFloat(value.toString());
};

export function InputConverter(converter?: (value: any) => any) {
  return (target: Object, key: string) => {
    if (converter === undefined) {
      let metadata = (<any>Reflect).getMetadata('design:type', target, key);

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

    let definition = Object.getOwnPropertyDescriptor(target, key);
    if (definition) {
      Object.defineProperty(target, key, {
        get: definition.get,
        set: newValue => {
          definition.set(converter(newValue));
        },
        enumerable: true,
        configurable: true
      });
    } else {
      Object.defineProperty(target, key, {
        get: function () {
          return this['__' + key];
        },
        set: function (newValue) {
          this['__' + key] = converter(newValue);
        },
        enumerable: true,
        configurable: true
      });
    }
  };
}
