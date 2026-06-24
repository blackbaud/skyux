const STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g;

export function decamelize(str: string): string {
  return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
}
