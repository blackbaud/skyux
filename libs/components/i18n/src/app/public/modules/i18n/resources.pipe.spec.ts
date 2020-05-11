import {
  of as observableOf
} from 'rxjs';

import {
  SkyAppResourcesPipe
} from './resources.pipe';

import {
  SkyAppResourcesService
} from './resources.service';

describe('Resources pipe', () => {
  let resources: SkyAppResourcesService;
  let changeDetector: any;

  beforeEach(() => {
    changeDetector = {
      markForCheck: jasmine.createSpy('markForCheck')
    };

    resources = {
      getString: (name: string, ...args) => {
        let value: string;

        if (args.length > 0) {
          value = 'format me ' + args[0];
        } else {
          value = 'hello';
        }

        return observableOf(value);
      }
    } as SkyAppResourcesService;
  });

  it('should return the expected string', () => {
    const pipe = new SkyAppResourcesPipe(changeDetector, resources);

    expect(pipe.transform('hi')).toBe('hello');
  });

  it('should return the expected string formatted with the specified parameters', () => {
    const pipe = new SkyAppResourcesPipe(changeDetector, resources);

    expect(pipe.transform('hi', 'abc')).toBe('format me abc');
  });

  it('should cache strings that have been retrieved via the resource service', () => {
    const pipe = new SkyAppResourcesPipe(changeDetector, resources);

    const getStringSpy = spyOn(resources, 'getString').and.callThrough();

    pipe.transform('hi');
    pipe.transform('hi');
    pipe.transform('hi');

    expect(getStringSpy).toHaveBeenCalledTimes(1);
  });

  it('should consider format args as part of the cache key', () => {
    const pipe = new SkyAppResourcesPipe(changeDetector, resources);

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
    const pipe = new SkyAppResourcesPipe(changeDetector, resources);

    pipe.transform('hi');
    pipe.transform('hi');
    pipe.transform('hi');

    expect(changeDetector.markForCheck).toHaveBeenCalledTimes(1);
  });
});
