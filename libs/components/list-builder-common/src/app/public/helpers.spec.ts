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
  compare,
  getData,
  isObservable
} from './helpers';

describe('list helpers', () => {

  describe('getData', () => {
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

    it('returns undefined when empty string selector defined', () => {
      let data = {
        myResult: 'something',
        otherResult: 'nothing'
      };
      let result = getData(data, '');
      expect(result).toBe(undefined);
    });

    it('returns undefined when no selector is supplied', () => {
      let data: any = {
        myResult: 'something',
        otherResult: 'somethingtoo'
      };
      let result = getData(data, undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('compare', () => {
    it('should compare null values', () => {
      /* tslint:disable:no-null-keyword */
      expect(compare(null, 'foo')).toEqual(1);
      expect(compare('foo', null)).toEqual(-1);
      /* tslint:enable:no-null-keyword */
    });

    it('should compare strings', () => {
      expect(compare('foo', 'bar')).toEqual(1);
      expect(compare('foo bar baz', 'foo bar baz')).toEqual(0);
    });

    it('should handle different cases when comparing', () => {
      expect(compare('FooBar', 'foobar')).toEqual(0);
    });

    it('should compare numbers', () => {
      expect(compare(1999, 2000)).toEqual(-1);
      expect(compare(2000, 2000)).toEqual(0);
      expect(compare(2000, 1999)).toEqual(1);
    });
  });

  describe('isObservable', () => {
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
});
