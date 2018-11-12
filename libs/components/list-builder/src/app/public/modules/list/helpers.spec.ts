// #region imports
import {
  EventEmitter
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  Subject
} from 'rxjs/Subject';

import {
  getData,
  isObservable
} from './helpers';
// #endregion

describe('list helpers', () => {
  it('gets data based on a standard selector', () => {
    let data = {
      myResult: 'something',
      otherResult: 'nothing'
    };
    let result = getData(data, 'myResult');
    expect(result).toBe('something');
  });

  it('shifts data appropriately when a selector is at the front', () => {
    let data = {
      myResult: 'something',
      otherResult: 'nothing'
    };
    let result = getData(data, '.myResult');
    expect(result).toBe('something');
  });

  it('returns properly when null data', () => {
    /* tslint:disable */
    let data: any = {
      myResult: null,
      otherResult: 'nothing'
    };
    /* tslint:enable */

    let result = getData(data, 'myResult');
    expect(result).toBeNull();
  });

  it('returns property when selector is a nested selector', () => {
    let data: any = {
      myResults: { nestedValue: 'expected'},
      otherResult: 'nothing'
    };
    let result = getData(data, 'myResults.nestedValue');
    expect(result).toBe('expected');
  });

  it('returns property when selector is a nested selector that does not exits', () => {
    let data: any = {
      myResults: {},
      otherResult: 'nothing'
    };
    let result = getData(data, 'myResults.nestedValue');
    expect(result).toBeNull();
  });

  it('returns property when selector is a nested selector that is undefined', () => {
    let data: any = {
      myResults: { nestedValue: undefined },
      otherResult: 'nothing'
    };
    let result = getData(data, 'myResults.nestedValue');
    expect(result).toBeNull();
  });

  it('returns null when empty string selector defined', () => {
    let data = {
      myResult: 'something',
      otherResult: 'nothing'
    };
    let result = getData(data, '');
    expect(result).toBe(undefined);
  });

  it('should check if an object is an observable', () => {
    const eventEmitter = new EventEmitter<void>();
    const observable = new Observable<void>();
    const subject = new Subject<void>();

    expect(isObservable(eventEmitter)).toEqual(true);
    expect(isObservable(observable)).toEqual(true);
    expect(isObservable(subject)).toEqual(true);
    expect(isObservable({})).toEqual(false);
    expect(isObservable('foobar')).toEqual(false);
  });
});
