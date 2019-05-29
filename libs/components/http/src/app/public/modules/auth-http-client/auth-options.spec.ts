//#region imports

import {
  HttpParams
} from '@angular/common/http';

import {
  skyAuthHttpJsonOptions,
  skyAuthHttpOptions
} from './auth-options';

//#endregion

describe('Auth options', () => {

  it('should add an auth parameter to the resulting options object', () => {
    const options = skyAuthHttpOptions();

    expect(options.params.get('sky_auth')).toBe('true');
  });

  it('should add a permission scope parameter and remove it from the options', () => {
    const options = skyAuthHttpOptions({
      permissionScope: 'abc'
    });

    expect(options.params.get('sky_permissionScope')).toBe('abc');

    expect('permissionScope' in options).toBe(false);
  });

  it('should preserve existing parameters', () => {
    const options = skyAuthHttpOptions({
      params: new HttpParams()
        .set('abc', '123')
    });

    expect(options.params.get('abc')).toBe('123');
  });

  it('should provide a method that enforces a responseType of json', () => {
    const options = skyAuthHttpJsonOptions();

    expect(options.responseType).toBe('json');
  });

});
