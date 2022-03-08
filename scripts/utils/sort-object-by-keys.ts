export function sortObjectByKeys(obj: { [_: string]: unknown }) {
  if (!obj) {
    return;
  }

  return Object.keys(obj)
    .sort()
    .reduce((item: any, key) => {
      item[key] = obj[key];
      return item;
    }, {});
}
