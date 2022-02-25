import { Observable } from 'rxjs';

/** @internal */
export function getData(item: any, selector: string): any {
  if (!selector) {
    return undefined;
  }

  let resultFieldParts = selector.split('.');
  if (resultFieldParts.length > 0 && resultFieldParts[0] === '') {
    resultFieldParts.shift();
  }

  let result = item;

  /* istanbul ignore else */
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

  return result;
}

/** @internal */
export function compare(value1: any, value2: any) {
  /* tslint:disable:no-null-keyword */
  if (value1 === null) {
    return 1;
  } else if (value2 === null) {
    return -1;
  }
  /* tslint:enable:no-null-keyword */

  if (value1 && typeof value1 === 'string') {
    value1 = value1.toLowerCase();
  }

  if (value2 && typeof value2 === 'string') {
    value2 = value2.toLowerCase();
  }
  if (value1 === value2) {
    return 0;
  }

  return value1 > value2 ? 1 : -1;
}

/*
  Taken directly from rxjs's internal utility to determine whether an object is an Obserable.
  See: https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/isObservable.ts
*/
/** @internal */
export function isObservable<T>(obj: any): obj is Observable<T> {
  /* istanbul ignore next */
  return (
    !!obj &&
    (obj instanceof Observable ||
      (typeof obj.lift === 'function' && typeof obj.subscribe === 'function'))
  );
}
