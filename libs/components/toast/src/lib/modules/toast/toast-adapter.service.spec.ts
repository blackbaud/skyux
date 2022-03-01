// #region imports
import { ApplicationRef, RendererFactory2 } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { SkyAppWindowRef } from '@skyux/core';

import { SkyToastAdapterService } from './toast-adapter.service';

// #endregion

describe('Toast adapter service', () => {
  let adapter: SkyToastAdapterService;
  const rendererCallCounts = {
    appendCalledCount: 0,
    removeCalledCount: 0,
  };
  let applicationRef: ApplicationRef;

  beforeEach(() => {
    const rendererMock = {
      appendChild: () => {
        rendererCallCounts.appendCalledCount++;
      },
      removeChild: () => {
        rendererCallCounts.removeCalledCount++;
      },
    };
    TestBed.configureTestingModule({
      providers: [
        SkyToastAdapterService,
        SkyAppWindowRef,
        {
          provide: RendererFactory2,
          useValue: {
            createRenderer() {
              return rendererMock;
            },
          },
        },
      ],
    });
    adapter = TestBed.get(SkyToastAdapterService);
  });

  beforeEach(inject([ApplicationRef], (_applicationRef: ApplicationRef) => {
    applicationRef = _applicationRef;
  }));

  it('should scroll to the bottom of an element correctly', () => {
    spyOn(window as any, 'setTimeout').and.callFake((fun: Function) => {
      fun();
    });
    const elementRefMock: any = {
      nativeElement: {
        scrollTop: undefined,
        scrollHeight: 40,
      },
    };
    adapter.scrollBottom(elementRefMock);
    applicationRef.tick();
    expect(elementRefMock.nativeElement.scrollTop).toBe(40);
  });
});
