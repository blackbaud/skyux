import { EventEmitter } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { compare, getData, isObservable } from './helpers';

describe('list helpers', () => {
  describe('getData', () => {
    it('gets data based on a standard selector', () => {
      const data = {
        myResult: 'something',
        otherResult: 'nothing',
      };
      const result = getData(data, 'myResult');
      expect(result).toBe('something');
    });

    it('shifts data appropriately when a selector is at the front', () => {
      const data = {
        myResult: 'something',
        otherResult: 'nothing',
      };
      const result = getData(data, '.myResult');
      expect(result).toBe('something');
    });

    it('returns properly when null data', () => {
      const data: any = {
        myResult: null,
        otherResult: 'nothing',
      };

      const result = getData(data, 'myResult');
      expect(result).toBeNull();
    });

    it('returns property when selector is a nested selector', () => {
      const data: any = {
        myResults: { nestedValue: 'expected' },
        otherResult: 'nothing',
      };
      const result = getData(data, 'myResults.nestedValue');
      expect(result).toBe('expected');
    });

    it('returns property when selector is a nested selector that does not exits', () => {
      const data: any = {
        myResults: {},
        otherResult: 'nothing',
      };
      const result = getData(data, 'myResults.nestedValue');
      expect(result).toBeNull();
    });

    it('returns property when selector is a nested selector that is undefined', () => {
      const data: any = {
        myResults: { nestedValue: undefined },
        otherResult: 'nothing',
      };
      const result = getData(data, 'myResults.nestedValue');
      expect(result).toBeNull();
    });

    it('returns undefined when empty string selector defined', () => {
      const data = {
        myResult: 'something',
        otherResult: 'nothing',
      };
      const result = getData(data, '');
      expect(result).toBe(undefined);
    });

    it('returns undefined when no selector is supplied', () => {
      const data: any = {
        myResult: 'something',
        otherResult: 'somethingtoo',
      };
      const result = getData(data, undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('compare', () => {
    it('should compare null values', () => {
      expect(compare(null, 'foo')).toEqual(1);
      expect(compare('foo', null)).toEqual(-1);
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
