//#region imports
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HttpClient, HttpParams } from '@angular/common/http';

import { getTestBed, TestBed } from '@angular/core/testing';

import { skyAuthHttpJsonOptions, skyAuthHttpOptions } from './auth-options';

//#endregion

describe('Auth options', () => {
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    const injector = getTestBed();

    http = injector.get(HttpClient);
  });

  it('should add an auth parameter to the resulting options object', () => {
    const options = skyAuthHttpOptions();

    expect(options.params.get('sky_auth')).toBe('true');
  });

  it('should add a permission scope parameter and remove it from the options', () => {
    const options = skyAuthHttpOptions({
      permissionScope: 'abc',
    });

    expect(options.params.get('sky_permissionScope')).toBe('abc');

    expect('permissionScope' in options).toBe(false);
  });

  it('should preserve existing parameters', () => {
    const options = skyAuthHttpOptions({
      params: new HttpParams().set('abc', '123'),
    });

    expect(options.params.get('abc')).toBe('123');
  });

  it('should provide a method that enforces a responseType of json', () => {
    const options = skyAuthHttpJsonOptions();

    expect(options.observe).toBe('body');
    expect(options.responseType).toBe('json');

    http
      .get<{ bar: string }>('https://www.example.com', options)
      .subscribe((_foo: { bar: string }) => {
        // The only thing being verified here is that the call to `http.get<T>()` compiles,
        // since it's possible changing the return type of `skyAuthHttpJsonOptions()` to
        // not match an overload of the `HttpClient` methods could result in a compiler error.
      });
  });
});
