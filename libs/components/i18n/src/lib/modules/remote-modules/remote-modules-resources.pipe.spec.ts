import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';

import { SkyRemoteModulesResourcesPipe } from './remote-modules-resources.pipe';
import { SkyRemoteModulesResourcesService } from './remote-modules-resources.service';

describe('remote-modules-resources.pipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SkyRemoteModulesResourcesPipe,
        {
          provide: ChangeDetectorRef,
          useValue: {
            markForCheck(): void {
              /* */
            },
          },
        },
        {
          provide: SkyRemoteModulesResourcesService,
          useValue: {
            getString(): Observable<string> {
              return of('STRING_VALUE');
            },
          },
        },
      ],
    });
  });

  it('should return a string resource', () => {
    const pipe = TestBed.inject(SkyRemoteModulesResourcesPipe);

    expect(pipe.transform('foo')).toEqual('STRING_VALUE');
  });

  it('should pass args to the service to be formatted', () => {
    const pipe = TestBed.inject(SkyRemoteModulesResourcesPipe);

    const svcSpy = spyOn(
      TestBed.inject(SkyRemoteModulesResourcesService),
      'getString',
    ).and.callThrough();

    pipe.transform('foo', 'bar', 'baz');

    expect(svcSpy).toHaveBeenCalledWith('foo', 'bar', 'baz');
  });

  it('should cache strings that have been retrieved via the resource service', () => {
    const pipe = TestBed.inject(SkyRemoteModulesResourcesPipe);

    const svcSpy = spyOn(
      TestBed.inject(SkyRemoteModulesResourcesService),
      'getString',
    ).and.callThrough();

    pipe.transform('foo');
    pipe.transform('foo');
    pipe.transform('foo');

    expect(svcSpy).toHaveBeenCalledTimes(1);
  });

  it('should respect args when caching the result', () => {
    const pipe = TestBed.inject(SkyRemoteModulesResourcesPipe);

    const svcSpy = spyOn(
      TestBed.inject(SkyRemoteModulesResourcesService),
      'getString',
    ).and.callThrough();

    pipe.transform('foo');
    pipe.transform('foo', 'bar');
    pipe.transform('foo', 'baz');

    pipe.transform('foo');
    pipe.transform('foo', 'bar');
    pipe.transform('foo', 'baz');

    expect(svcSpy).toHaveBeenCalledTimes(3);
  });
});
