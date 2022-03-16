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

export function InputConverter(converter: (value: any) => any) {
  return (target: any, key: string) => {
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
