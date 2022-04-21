import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyAppWindowRef } from '@skyux/core';

import { SkySkipLinkAdapterService } from './skip-link-adapter.service';

describe('Skip link adapter service', () => {
  const BODY_MARGIN_TOP = 56;
  const TEST_EL_TOP = 83;
  const ADAPTER_SVC_PADDING = 10;

  let mockWindowService: any;
  let scrollSpy: jasmine.Spy;
  let service: SkySkipLinkAdapterService;
  let testEl: HTMLDivElement;

  beforeEach(() => {
    scrollSpy = jasmine.createSpy('scroll');

    mockWindowService = {
      nativeWindow: {
        document: {
          body: {},
        },
        getComputedStyle: () => ({
          marginTop: BODY_MARGIN_TOP + 'px',
        }),
        scroll: scrollSpy,
      },
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SkyAppWindowRef,
          useValue: mockWindowService,
        },
        SkySkipLinkAdapterService,
      ],
    });

    service = TestBed.get(SkySkipLinkAdapterService);

    testEl = document.createElement('div');
    testEl.style.height = window.outerHeight + 1000 + 'px';
    testEl.style.position = 'absolute';
    testEl.style.top = TEST_EL_TOP + 'px';

    testEl.innerText = 'Testing';

    document.body.appendChild(testEl);
  });

  afterEach(() => {
    document.body.removeChild(testEl);

    testEl = undefined;
  });

  it("should account for the browser's margin top property", () => {
    service.skipTo({
      title: 'Test 1',
      elementRef: new ElementRef(testEl),
    });

    expect(scrollSpy).toHaveBeenCalledWith(
      0,
      TEST_EL_TOP - BODY_MARGIN_TOP - ADAPTER_SVC_PADDING
    );
  });
});
