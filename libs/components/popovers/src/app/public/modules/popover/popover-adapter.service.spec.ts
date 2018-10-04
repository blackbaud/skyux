import {
  ElementRef,
  Renderer2
} from '@angular/core';

import {
  inject,
  TestBed
} from '@angular/core/testing';

import {
  SkyWindowRefService
} from '@skyux/core/modules/window';

import {
  SkyPopoverAdapterService
} from './popover-adapter.service';

import {
  SkyPopoverPosition
} from './types';

describe('SkyPopoverAdapterService', () => {
  let mockRenderer: any;
  let mockBody: any;

  class MockWindowService {
    public getWindow(): any {
      return {
        innerWidth: 1000,
        innerHeight: 1000,
        document: {
          body: mockBody
        },
        getComputedStyle() {}
      };
    }
  }

  function createElementRefDefinition(
    top = 0,
    left = 0,
    width = 0,
    height = 0
  ) {
    const elem = document.createElement('div');
    elem.getBoundingClientRect = function () {
      const right = left + width;
      const bottom = top + height;
      return {
        top: top,
        left: left,
        width: width,
        height: height,
        right,
        bottom
      };
    };

    Object.defineProperty(elem, 'parentNode', {
      value: mockBody,
      writable: true
    });

    return elem;
  }

  function verifyPosition(
    position: SkyPopoverPosition,
    top: number,
    left: number,
    arrowTop: number,
    arrowLeft: number
  ) {
    expect(position.top).toEqual(top);
    expect(position.left).toEqual(left);
    expect(position.arrowTop).toEqual(arrowTop);
    expect(position.arrowLeft).toEqual(arrowLeft);
  }

  function getArrowRef() {
    return new ElementRef(createElementRefDefinition(0, 0, 20, 10));
  }

  function spyOnWindowGetComputedStyle(windowService: SkyWindowRefService, result: any) {
    spyOn(windowService, 'getWindow').and.callFake(() => {
      const obj = new MockWindowService().getWindow();
      obj.getComputedStyle = () => ({ overflowY: 'auto' });
      return obj;
    });
  }

  function getListenersForOverflowParents(overflow: string) {
    let listeners: any[] = [];

    inject([SkyPopoverAdapterService, SkyWindowRefService], (
      adapterService: SkyPopoverAdapterService,
      windowService: SkyWindowRefService
    ) => {
      spyOn(windowService, 'getWindow').and.callFake(() => {
        const obj = new MockWindowService().getWindow();
        obj.getComputedStyle = () => ({ overflowY: overflow });
        return obj;
      });
      const popover = new ElementRef(createElementRefDefinition(0, 0, 100, 100));
      const parentElement = createElementRefDefinition(0, 0, 1200, 800);
      popover.nativeElement.parentNode = parentElement;

      listeners.push(adapterService.getParentScrollListeners(popover, () => {}));
    })();

    return listeners;
  }

  beforeEach(() => {
    mockRenderer = {
      removeStyle() {},
      setStyle() {},
      addClass() {},
      removeClass() {},
      listen() {}
    };

    mockBody = {};

    TestBed.configureTestingModule({
      providers: [
        SkyPopoverAdapterService,
        { provide: Renderer2, useValue: mockRenderer },
        { provide: SkyWindowRefService, useValue: new MockWindowService() }
      ]
    });
  });

  it('should allow for left and right placements',
    inject([SkyPopoverAdapterService], (adapterService: SkyPopoverAdapterService) => {
      const caller = new ElementRef(createElementRefDefinition(200, 200, 40, 40));
      const popover = new ElementRef(createElementRefDefinition(0, 0, 100, 100));
      const popoverArrow = getArrowRef();

      let position = adapterService.getPopoverPosition({
        popover,
        popoverArrow,
        caller
      }, 'left', undefined);

      verifyPosition(position, 170, 100, 50, undefined);

      position = adapterService.getPopoverPosition({
        popover,
        popoverArrow,
        caller
      }, 'right', undefined);

      verifyPosition(position, 170, 240, 50, undefined);
    })
  );

  it('should allow for above and below placements',
    inject([SkyPopoverAdapterService], (adapterService: SkyPopoverAdapterService) => {
      const caller = new ElementRef(createElementRefDefinition(200, 200, 40, 40));
      const popover = new ElementRef(createElementRefDefinition(0, 0, 100, 100));
      const popoverArrow = getArrowRef();

      let position = adapterService.getPopoverPosition({
        popover,
        popoverArrow,
        caller
      }, 'above', undefined);

      verifyPosition(position, 100, 170, undefined, 50);

      position = adapterService.getPopoverPosition({
        popover,
        popoverArrow,
        caller
      }, 'below', undefined);

      verifyPosition(position, 240, 170, undefined, 50);
    })
  );

  it('should handle invalid placement and alignment values',
    inject([SkyPopoverAdapterService], (adapterService: SkyPopoverAdapterService) => {
      const popover = new ElementRef(createElementRefDefinition(0, 0, 180, 70));
      const popoverArrow = getArrowRef();

      const position = (adapterService as any).getPopoverPosition({
        popover,
        popoverArrow,
        caller: new ElementRef(createElementRefDefinition(200, 200, 80, 34))
      }, 'foo', 'bar');

      verifyPosition(position, undefined, undefined, undefined, undefined);
    })
  );

  it('should allow for left and right alignment',
    inject([SkyPopoverAdapterService], (adapterService: SkyPopoverAdapterService) => {
      const caller = new ElementRef(createElementRefDefinition(200, 200, 80, 40));
      const popover = new ElementRef(createElementRefDefinition(0, 0, 180, 70));
      const popoverArrow = getArrowRef();

      let position = adapterService.getPopoverPosition({
        popover,
        popoverArrow,
        caller
      }, 'below', 'left');

      verifyPosition(position, 240, 200, undefined, 40);

      position = adapterService.getPopoverPosition({
        popover,
        popoverArrow,
        caller
      }, 'below', 'right');

      verifyPosition(position, 240, 100, undefined, 140);

      position = adapterService.getPopoverPosition({
        popover,
        popoverArrow,
        caller
      }, 'above', 'left');

      verifyPosition(position, 130, 200, undefined, 40);

      position = adapterService.getPopoverPosition({
        popover,
        popoverArrow,
        caller
      }, 'above', 'right');

      verifyPosition(position, 130, 100, undefined, 140);
    })
  );

  it('should reverse placement if outside viewport',
    inject([SkyPopoverAdapterService], (adapterService: SkyPopoverAdapterService) => {
      const position = adapterService.getPopoverPosition({
        popover: new ElementRef(createElementRefDefinition(0, 0, 276, 100)),
        popoverArrow: new ElementRef(createElementRefDefinition()),
        caller: new ElementRef(createElementRefDefinition(0, 0, 100, 34))
      }, 'above', undefined);

      expect(position.placement).toEqual('below');
    })
  );

  it('should return placement of fullscreen if popover dimensions greater than viewport',
    inject([SkyPopoverAdapterService, SkyWindowRefService], (
      adapterService: SkyPopoverAdapterService,
      windowService: SkyWindowRefService
    ) => {
      spyOn(windowService, 'getWindow').and.returnValue({
        setTimeout(callback: Function) {
          callback();
        },
        innerWidth: 300,
        innerHeight: 300
      });

      const position = adapterService.getPopoverPosition({
        popover: new ElementRef(createElementRefDefinition(0, 0, 1500, 1500)),
        popoverArrow: new ElementRef(createElementRefDefinition()),
        caller: new ElementRef(createElementRefDefinition(0, 0, 100, 34))
      }, 'above', undefined);

      expect(position.placement).toEqual('fullscreen');
    })
  );

  it('should only check for optimal placements a few times',
    inject([SkyPopoverAdapterService, SkyWindowRefService], (
      adapterService: SkyPopoverAdapterService,
      windowService: SkyWindowRefService
    ) => {
      const spy = spyOn(adapterService as any, 'getPopoverCoordinates').and.callThrough();

      spyOn(windowService, 'getWindow').and.returnValue({
        setTimeout(callback: Function) {
          callback();
        },
        innerWidth: 300,
        innerHeight: 300
      });

      const elements = {
        popover: new ElementRef(createElementRefDefinition(0, 0, 276, 276)),
        popoverArrow: new ElementRef(createElementRefDefinition()),
        caller: new ElementRef(createElementRefDefinition(0, 0, 50, 50))
      };

      const position = adapterService.getPopoverPosition(elements, 'right', undefined);

      expect(spy.calls.count()).toEqual(4);
      expect(spy.calls.argsFor(0)[1]).toEqual('right');
      expect(spy.calls.argsFor(1)[1]).toEqual('left');
      expect(spy.calls.argsFor(2)[1]).toEqual('above');
      expect(spy.calls.argsFor(3)[1]).toEqual('below');
      expect(position.placement).toEqual('fullscreen');
    })
  );

  it('should hide a popover',
    inject([SkyPopoverAdapterService], (adapterService: SkyPopoverAdapterService) => {
      const spy = spyOn(adapterService['renderer'], 'addClass');
      const elem = new ElementRef({ nativeElement: {} });
      adapterService.hidePopover(elem);
      expect(spy).toHaveBeenCalledWith(elem.nativeElement, 'sky-popover-hidden');
    })
  );

  it('should show a popover',
    inject([SkyPopoverAdapterService], (adapterService: SkyPopoverAdapterService) => {
      const spy = spyOn(adapterService['renderer'], 'removeClass');
      const elem = new ElementRef({ nativeElement: {} });
      adapterService.showPopover(elem);
      expect(spy).toHaveBeenCalledWith(elem.nativeElement, 'sky-popover-hidden');
    })
  );

  it('should detect if popover is larger than viewport',
    inject([SkyPopoverAdapterService], (adapterService: SkyPopoverAdapterService) => {
      let elem = new ElementRef(createElementRefDefinition(0, 0, 1100, 1100));
      let isLarger = adapterService.isPopoverLargerThanParent(elem);
      expect(isLarger).toEqual(true);

      elem = new ElementRef(createElementRefDefinition(0, 0, 1100, 10));
      isLarger = adapterService.isPopoverLargerThanParent(elem);
      expect(isLarger).toEqual(true);

      elem = new ElementRef(createElementRefDefinition(0, 0, 10, 1100));
      isLarger = adapterService.isPopoverLargerThanParent(elem);
      expect(isLarger).toEqual(true);

      elem = new ElementRef(createElementRefDefinition(0, 0, 10, 10));
      isLarger = adapterService.isPopoverLargerThanParent(elem);
      expect(isLarger).toEqual(false);
    })
  );

  it('should handle out-of-bounds coordinates for arrows',
    inject([SkyPopoverAdapterService], (adapterService: SkyPopoverAdapterService) => {
      // Make the button larger than the screen:
      const caller = new ElementRef(createElementRefDefinition(200, 200, 5000, 40));
      const popover = new ElementRef(createElementRefDefinition(0, 0, 100, 100));
      const popoverArrow = getArrowRef();

      let position = adapterService.getPopoverPosition({
        popover,
        popoverArrow,
        caller
      }, 'above', 'left');

      expect(position.arrowTop).toEqual(undefined);
      expect(position.arrowLeft).toEqual(80);

      position = adapterService.getPopoverPosition({
        popover,
        popoverArrow,
        caller
      }, 'below', 'right');

      expect(position.arrowTop).toEqual(undefined);
      expect(position.arrowLeft).toEqual(80);
    })
  );

  describe('scrollable parent listeners', () => {
    it('should default to listening for window scroll events',
      inject([SkyPopoverAdapterService], (
        adapterService: SkyPopoverAdapterService
      ) => {
        let scrollableParent: any;
        let eventName: string;
        spyOn(adapterService['renderer'], 'listen').and.callFake((target: any, event: string, callback: any) => {
          scrollableParent = target;
          eventName = event;
          callback();
        });

        let isVisible = false;
        const callback = (isVisibleWithinScrollable: boolean) => {
          isVisible = isVisibleWithinScrollable;
        };

        const popover = new ElementRef(createElementRefDefinition(0, 0, 100, 100));
        const listeners = adapterService.getParentScrollListeners(popover, callback);
        expect(listeners.length).toEqual(1);
        expect(isVisible).toEqual(true);
        expect(scrollableParent).toEqual('window');
        expect(eventName).toEqual('scroll');
      })
    );

    it('should listen for `overflow: auto` parent element scroll events',
      inject([SkyPopoverAdapterService, SkyWindowRefService], (
        adapterService: SkyPopoverAdapterService,
        windowService: SkyWindowRefService
      ) => {
        spyOnWindowGetComputedStyle(windowService, 'auto');

        let scrollableParents: any[] = [];
        let eventName: string;
        spyOn(adapterService['renderer'], 'listen').and.callFake((target: any, event: string, callback: any) => {
          scrollableParents.push(target);
          eventName = event;
          callback();
        });

        let isVisible = false;
        const callback = (isVisibleWithinScrollable: boolean) => {
          isVisible = isVisibleWithinScrollable;
        };

        const popover = new ElementRef(createElementRefDefinition(0, 0, 100, 100));
        const parentElement = createElementRefDefinition(0, 0, 1200, 0);

        popover.nativeElement.parentNode = parentElement;

        const listeners = adapterService.getParentScrollListeners(popover, callback);
        expect(listeners.length).toEqual(2);
        expect(isVisible).toEqual(true);
        expect(scrollableParents[0]).toEqual('window');
        expect(scrollableParents[1]).toEqual(parentElement);
        expect(eventName).toEqual('scroll');
      })
    );

    it('should hide the popover if 95% of top is clipped',
      inject([SkyPopoverAdapterService, SkyWindowRefService], (
        adapterService: SkyPopoverAdapterService,
        windowService: SkyWindowRefService
      ) => {
        spyOnWindowGetComputedStyle(windowService, 'auto');

        spyOn(adapterService['renderer'], 'listen').and.callFake((target: any, event: string, callback: any) => {
          callback();
        });

        let isVisible = true;
        const callback = (isVisibleWithinScrollable: boolean) => {
          isVisible = isVisibleWithinScrollable;
        };

        const popover = new ElementRef(createElementRefDefinition(-20, 0, 100, 100));
        const parentElement = createElementRefDefinition(0, 0, 1200, 800);

        popover.nativeElement.parentNode = parentElement;

        adapterService.getParentScrollListeners(popover, callback);
        expect(isVisible).toEqual(false);
      })
    );

    it('should hide the popover if 95% of bottom is clipped',
      inject([SkyPopoverAdapterService, SkyWindowRefService], (
        adapterService: SkyPopoverAdapterService,
        windowService: SkyWindowRefService
      ) => {
        spyOnWindowGetComputedStyle(windowService, 'auto');

        spyOn(adapterService['renderer'], 'listen').and.callFake((target: any, event: string, callback: any) => {
          callback();
        });

        let isVisible = true;
        const callback = (isVisibleWithinScrollable: boolean) => {
          isVisible = isVisibleWithinScrollable;
        };

        const popover = new ElementRef(createElementRefDefinition(0, 0, 100, 1000));
        const parentElement = createElementRefDefinition(0, 0, 1200, 800);

        popover.nativeElement.parentNode = parentElement;

        adapterService.getParentScrollListeners(popover, callback);
        expect(isVisible).toEqual(false);
      })
    );

    it('should listen for `overflow: hidden` parent element scroll events', () => {
      const listeners = getListenersForOverflowParents('hidden');
      expect(listeners.length).toEqual(1);
    });

    it('should listen for `overflow: scroll` parent element scroll events', () => {
      const listeners = getListenersForOverflowParents('scroll');
      expect(listeners.length).toEqual(1);
    });

    it('should ignore parent elements without scrollbars', () => {
      const listeners = getListenersForOverflowParents('foo');
      expect(listeners.length).toEqual(1);
    });
  });

  describe('popover sticks to caller', () => {
    it('should stick to the caller right',
      inject([SkyPopoverAdapterService], (adapterService: SkyPopoverAdapterService) => {
        // Caller right is beyond viewport width:
        const caller = new ElementRef(createElementRefDefinition(200, 1200, 40, 40));
        const popover = new ElementRef(createElementRefDefinition(0, 0, 100, 100));
        const popoverArrow = getArrowRef();

        const position = adapterService.getPopoverPosition({
          popover,
          popoverArrow,
          caller
        }, 'above', undefined);

        expect(position.top).toEqual(100);
        expect(position.left).toEqual(1140);
      })
    );

    it('should stick to the caller left',
      inject([SkyPopoverAdapterService], (adapterService: SkyPopoverAdapterService) => {
        // Caller left is less than zero:
        const caller = new ElementRef(createElementRefDefinition(200, -1000, 40, 40));
        const popover = new ElementRef(createElementRefDefinition(0, 0, 100, 100));
        const popoverArrow = getArrowRef();

        const position = adapterService.getPopoverPosition({
          popover,
          popoverArrow,
          caller
        }, 'below', undefined);

        expect(position.top).toEqual(240);
        expect(position.left).toEqual(-1000);
      })
    );

    it('should stick to the caller top',
      inject([SkyPopoverAdapterService], (adapterService: SkyPopoverAdapterService) => {
        // Caller top is less than viewport width:
        const caller = new ElementRef(createElementRefDefinition(-200, 200, 40, 40));
        const popover = new ElementRef(createElementRefDefinition(0, 0, 100, 100));
        const popoverArrow = getArrowRef();

        const position = adapterService.getPopoverPosition({
          popover,
          popoverArrow,
          caller
        }, 'right', undefined);

        expect(position.top).toEqual(-200);
        expect(position.left).toEqual(240);
      })
    );

    it('should stick to the caller bottom',
      inject([SkyPopoverAdapterService], (adapterService: SkyPopoverAdapterService) => {
        // Caller bottom is beyond viewport height:
        const caller = new ElementRef(createElementRefDefinition(1200, 200, 40, 40));
        const popover = new ElementRef(createElementRefDefinition(0, 0, 100, 100));
        const popoverArrow = getArrowRef();

        const position = adapterService.getPopoverPosition({
          popover,
          popoverArrow,
          caller
        }, 'left', undefined);

        expect(position.top).toEqual(1140);
        expect(position.left).toEqual(100);
      })
    );
  });
});
