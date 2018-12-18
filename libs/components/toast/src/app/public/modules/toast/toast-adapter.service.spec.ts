// #region imports
import {
  RendererFactory2,
  ApplicationRef
} from '@angular/core';

import {
  TestBed,
  inject
} from '@angular/core/testing';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  SkyToastAdapterService
} from './toast-adapter.service';
// #endregion

describe('Toast adapter service', () => {

  let adapter: SkyToastAdapterService;
  let rendererCallCounts = {
    appendCalledCount: 0,
    removeCalledCount: 0
  };
  let applicationRef: ApplicationRef;

  beforeEach(() => {
    let rendererMock = {
      appendChild: () => { rendererCallCounts.appendCalledCount++; },
      removeChild: () => { rendererCallCounts.removeCalledCount++; }
    };
    TestBed.configureTestingModule({
      providers: [
        SkyToastAdapterService,
        SkyWindowRefService,
        {
          provide: RendererFactory2,
          useValue: {
            createRenderer() { return rendererMock; }
          }
        }
      ]
    });
    adapter = TestBed.get(SkyToastAdapterService);
  });

  beforeEach(
    inject(
      [
        ApplicationRef
      ],
      (
        _applicationRef: ApplicationRef
      ) => {
        applicationRef = _applicationRef;
      }
    )
  );

  it('should scroll to the bottom of an element correctly', () => {
    spyOn(window, 'setTimeout').and.callFake((fun: Function) => {
      fun();
    });
    let elementRefMock: any = {
      nativeElement: {
        scrollTop: undefined,
        scrollHeight: 40
      }
    };
    adapter.scrollBottom(elementRefMock);
    applicationRef.tick();
    expect(elementRefMock.nativeElement.scrollTop).toBe(40);
  });
});
