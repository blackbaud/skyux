import { Observable } from 'rxjs';

/** @internal */
export function getValue(property: any, callback: any): Observable<any> {
  if (property instanceof Observable) {
    property.subscribe((value) => callback(value));
    return property;
  } else {
    return callback(property);
  }
}
