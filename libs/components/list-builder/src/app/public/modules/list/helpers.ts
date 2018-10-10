import { Observable } from 'rxjs/Observable';
import {$$observable as symbolObservable} from 'rxjs/symbol/observable';

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
  Taken from @angular's internal library to determine whether an object is an Obserable.
  https://github.com/angular/angular/commit/109f0d1
*/
export function isObservable(obj: any | Observable<any>): obj is Observable<any> {
  return !!(obj && obj[symbolObservable]);
}
