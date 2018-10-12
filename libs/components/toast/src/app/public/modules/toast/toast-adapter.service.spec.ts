// #region imports
import {
  RendererFactory2
} from '@angular/core';

import {
  TestBed
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

  it('should append element to body', () => {
    adapter.appendToBody(undefined);
    expect(rendererCallCounts.appendCalledCount).toBe(1);
  });

  it('should remove element from body', () => {
    adapter.removeHostElement();
    expect(rendererCallCounts.removeCalledCount).toBe(1);
  });
});
