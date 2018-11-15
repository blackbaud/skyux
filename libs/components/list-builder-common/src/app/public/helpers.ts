export function getData(item: any, selector: string): any {
  let resultFieldParts = selector.split('.');
  if (resultFieldParts.length > 0 && resultFieldParts[0] === '') {
    resultFieldParts.shift();
  }

  let result = item;
  if (resultFieldParts.length > 0) {
    for (let index = 0; index < resultFieldParts.length; index++) {
    let part = resultFieldParts[index];
      /* tslint:disable:no-null-keyword */
      /* istanbul ignore else */
      if (result[part] === null || result[part] === undefined) {
        result = null;
        break;
      }
      /* tslint:enable:no-null-keyword */

      result = result[part];
    }
  }

  if (result === item) {
    return undefined;
  }

  return result;
}
