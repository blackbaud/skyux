// #region imports
import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/observable/of';

import {
  SkyLibResourcesPipe
} from './lib-resources.pipe';

import {
  SkyLibResourcesService
} from './lib-resources.service';
// #endregion

describe('Library resources pipe', () => {
  let resources: SkyLibResourcesService;
  let changeDetector: any;

  beforeEach(() => {
    changeDetector = {
      markForCheck: jasmine.createSpy('markForCheck')
    };

    resources = {
      getString: (name: string, ...args: any[]) => {
        let value: string;

        if (args && args.length > 0) {
          value = 'format me ' + args.join(' ');
        } else {
          value = 'hello';
        }

        return Observable.of(value);
      }
    } as SkyLibResourcesService;
  });

  it('should return the expected string', () => {
    const pipe = new SkyLibResourcesPipe(changeDetector, resources);
    expect(pipe.transform('hi')).toBe('hello');
  });

  it('should return the expected string formatted with the specified parameters', () => {
    const pipe = new SkyLibResourcesPipe(changeDetector, resources);
    expect(pipe.transform('hi', 'abc', 'def')).toBe('format me abc def');
  });

  it('should cache strings that have been retrieved via the resource service', () => {
    const pipe = new SkyLibResourcesPipe(changeDetector, resources);

    const getStringSpy = spyOn(resources, 'getString').and.callThrough();

    pipe.transform('hi');
    pipe.transform('hi');
    pipe.transform('hi');

    expect(getStringSpy).toHaveBeenCalledTimes(1);
  });

  it('should consider format args as part of the cache key', () => {
    const pipe = new SkyLibResourcesPipe(changeDetector, resources);
    const getStringSpy = spyOn(resources, 'getString').and.callThrough();

    expect(pipe.transform('hi')).toBe('hello');
    expect(pipe.transform('hi', 'abc')).toBe('format me abc');
    expect(pipe.transform('hi')).toBe('hello');
    expect(pipe.transform('hi', 'abc')).toBe('format me abc');
    expect(pipe.transform('hi')).toBe('hello');
    expect(pipe.transform('hi', 'abc')).toBe('format me abc');

    expect(getStringSpy).toHaveBeenCalledTimes(2);
  });

  it('should mark the change detector for check when the string is loaded asynchronously', () => {
    const pipe = new SkyLibResourcesPipe(changeDetector, resources);

    pipe.transform('hi');
    pipe.transform('hi');
    pipe.transform('hi');

    expect(changeDetector.markForCheck).toHaveBeenCalledTimes(1);
  });
});
