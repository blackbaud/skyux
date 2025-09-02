import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkyViewkeeper } from './viewkeeper';

describe('Viewkeeper', () => {
  let boundaryEl: HTMLElement;
  let el: HTMLElement;
  let scrollableHostEl: HTMLElement;
  let vks: SkyViewkeeper[];

  function scrollWindowTo(x: number, y: number): void {
    window.scrollTo({
      top: y,
      left: x,
      behavior: 'instant',
    });
    SkyAppTestUtility.fireDomEvent(window, 'scroll');
  }

  function scrollScrollableHost(x: number, y: number): void {
    scrollableHostEl.scrollTo({
      top: y,
      left: x,
      behavior: 'instant',
    });
    SkyAppTestUtility.fireDomEvent(scrollableHostEl, 'scroll');
  }

  function validateElStyle(
    elToValidate: HTMLElement,
    styleProperty: keyof CSSStyleDeclaration,
    expectedValue: string,
  ): void {
    expect(getComputedStyle(elToValidate)[styleProperty]).toBe(expectedValue);
  }

  function validatePinned(
    elToValidate: HTMLElement,
    pinned: boolean,
    pinnedTop?: number,
    marginTop = 0,
  ): void {
    if (pinned) {
      validateElStyle(elToValidate, 'position', 'fixed');
      validateElStyle(elToValidate, 'top', pinnedTop + 'px');
      validateElStyle(elToValidate, 'marginTop', marginTop + 'px');
    } else {
      validateElStyle(elToValidate, 'position', 'static');
      validateElStyle(elToValidate, 'top', 'auto');
    }
  }

  function createContentEl(
    height: string,
    width: string,
    color: string,
    text: string,
  ): HTMLElement {
    const content = document.createElement('div');
    content.style.height = height;
    content.style.width = width;
    content.style.backgroundColor = color;
    content.appendChild(document.createTextNode(text));
    return content;
  }

  describe('page viewkeepers', () => {
    beforeEach(() => {
      vks = [];

      el = document.createElement('div');
      el.style.height = '30px';
      el.style.backgroundColor = 'red';

      boundaryEl = document.createElement('div');
      boundaryEl.style.marginTop = '10px';
      boundaryEl.style.width = '500px';
      boundaryEl.style.height = window.innerHeight + 100 + 'px';

      boundaryEl.appendChild(el);

      document.body.insertBefore(boundaryEl, document.body.firstChild);
    });

    afterEach(() => {
      for (const vk of vks) {
        vk.destroy();
      }

      boundaryEl.parentElement?.removeChild(boundaryEl);

      window.scrollTo(0, 0);
    });

    it('should pin an item to the top of its boundary element when scrolled out of view', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          viewportMarginTop: 5,
        }),
      );

      scrollWindowTo(0, 20);

      validatePinned(el, true, 0, 5);

      scrollWindowTo(0, 0);

      validatePinned(el, false);
    });

    it('should set the viewkeeper element`s width when configured to do so', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          setWidth: true,
          viewportMarginTop: 5,
        }),
      );

      scrollWindowTo(0, 20);

      validatePinned(el, true, 0, 5);

      expect(getComputedStyle(el).width).toBe(
        getComputedStyle(boundaryEl).width,
      );
    });

    it('should not pin an item to the top of its boundary element if it is not visible', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
        }),
      );

      el.style.display = 'none';

      scrollWindowTo(0, 20);

      validatePinned(el, false);
    });

    it('should pin an item under the specified vertical offset element', () => {
      const verticalOffsetEl = document.createElement('div');
      verticalOffsetEl.style.height = '50px';
      verticalOffsetEl.style.backgroundColor = 'blue';

      boundaryEl.insertBefore(verticalOffsetEl, el);

      vks.push(
        new SkyViewkeeper({
          el: verticalOffsetEl,
          boundaryEl,
        }),
      );

      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          verticalOffsetEl,
        }),
      );

      scrollWindowTo(0, 100);

      validatePinned(verticalOffsetEl, true, 0);
      validatePinned(el, true, 50);

      scrollWindowTo(0, 0);

      validatePinned(verticalOffsetEl, false);
      validatePinned(el, false);
    });

    it('should destroy the viewkeeper', () => {
      const vk = new SkyViewkeeper({
        el,
        boundaryEl,
        viewportMarginTop: 5,
      });

      // Scroll the window so that the class list is updated.
      scrollWindowTo(0, 20);
      expect(Array.from(el.classList)).toEqual(['sky-viewkeeper-fixed']);

      const removeEventListenerSpy = spyOn(
        window,
        'removeEventListener',
      ).and.callThrough();

      vk.destroy();

      // Verify that the viewkeeper class has been removed.
      expect(Array.from(el.classList)).toEqual([]);

      const calls = removeEventListenerSpy.calls.all();
      expect(calls[0].args[0]).toEqual('scroll');
      expect(calls[1].args[0]).toEqual('resize');
      expect(calls[2].args[0]).toEqual('orientationchange');
      removeEventListenerSpy.calls.reset();

      vk.destroy();

      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    it('should throw an error if `el` not provided', () => {
      expect(() => new SkyViewkeeper({})).toThrowError(
        '[SkyViewkeeper] The option `el` is required.',
      );
    });

    it('should throw an error if `boundaryEl` not provided', () => {
      expect(() => new SkyViewkeeper({ el })).toThrowError(
        '[SkyViewkeeper] The option `boundaryEl` is required.',
      );
    });

    it('should support viewportMarginProperty', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          viewportMarginProperty: '--test-viewport-top',
          setWidth: true,
        }),
      );

      scrollWindowTo(0, 10);
      validatePinned(el, false);
      document.documentElement.style.setProperty('--test-viewport-top', '2px');
      scrollWindowTo(40, 100);
      validatePinned(el, true, 0, 2);
      expect(el.style.marginTop).toBe(
        'calc(0px + var(--test-viewport-top, 0px))',
      );

      // Verify computed style is calculated correctly when viewport property is set
      const computedStyle = window.getComputedStyle(el);
      expect(computedStyle.marginTop).toBe('2px');

      document.documentElement.style.setProperty('--test-viewport-top', '12px');
      validatePinned(el, true, 0, 12);

      // Verify computed style updates correctly when property value changes
      const updatedComputedStyle = window.getComputedStyle(el);
      expect(updatedComputedStyle.marginTop).toBe('12px');

      document.documentElement.style.removeProperty('--test-viewport-top');
      document.body.style.removeProperty('--test-viewport-top');
    });

    it('should compute correct margin when viewportMarginProperty fallback is used', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          viewportMarginTop: 5,
          viewportMarginProperty: '--test-viewport-fallback',
          setWidth: true,
        }),
      );

      scrollWindowTo(0, 5);
      validatePinned(el, false);

      // Scroll to trigger pinning (without setting the CSS property, so fallback is used)
      scrollWindowTo(40, 100);
      validatePinned(el, true, 0, 5);

      // Verify CSS calc() expression uses proper units for fallback
      expect(el.style.marginTop).toBe(
        'calc(5px + var(--test-viewport-fallback, 0px))',
      );

      // Verify computed style when property is not set (uses fallback 0px)
      const computedStyle = window.getComputedStyle(el);
      expect(computedStyle.marginTop).toBe('5px');
    });

    describe('ResizeObserver', () => {
      const NativeResizeObserver = ResizeObserver;

      let observer: ResizeObserver | undefined;
      let observerCallback: ResizeObserverCallback | undefined;

      beforeEach(() => {
        window.ResizeObserver = class {
          constructor(callback: ResizeObserverCallback) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            observer = this;
            observerCallback = callback;
          }

          public disconnect(): void {
            /**/
          }

          public observe(): void {
            /**/
          }

          public unobserve(): void {
            /**/
          }
        };
      });

      afterEach(() => {
        window.ResizeObserver = NativeResizeObserver;
        observer = observerCallback = undefined;
      });

      it("should update the viewkeeper element's width when the spacer element's width changes", () => {
        vks.push(
          new SkyViewkeeper({
            el,
            boundaryEl,
            setWidth: true,
          }),
        );

        scrollWindowTo(0, 20);

        validatePinned(el, true, 0);

        expect(getComputedStyle(el).width).toBe(
          getComputedStyle(boundaryEl).width,
        );

        boundaryEl.style.width = '10px';

        expect(getComputedStyle(el).width).not.toBe('10px');

        // Resizing the boundary element doesn't cause a reflow of the
        // document in the unit test, and manually causing a reflow
        // like with requestAnimationFrame() causes the element to
        // resize to the width of the spacer element even without the
        // ResizeObserver. Call the mock ResizeObserver's callback
        // explicitly here to test that the element is resized.
        if (observer && observerCallback) {
          observerCallback([], observer);
        }

        expect(getComputedStyle(el).width).toBe('10px');
      });

      it('should destroy the ResizeObserver when the viewkeeper is destroyed', () => {
        const vk = new SkyViewkeeper({
          el,
          boundaryEl,
          setWidth: true,
        });

        // The ResizeObserver should only be created the first time the viewkeeper
        // element is pinned.
        expect(observer).toBeUndefined();

        scrollWindowTo(0, 20);

        validatePinned(el, true, 0);

        const disconnectSpy = observer && spyOn(observer, 'disconnect');

        expect(disconnectSpy).not.toHaveBeenCalled();

        vk.destroy();

        expect(disconnectSpy).toHaveBeenCalledOnceWith();
      });
    });
  });

  describe('scrollable parent viewkeepers', () => {
    beforeEach(() => {
      vks = [];

      el = document.createElement('div');
      el.style.height = '30px';
      el.style.backgroundColor = 'red';
      el.appendChild(document.createTextNode('Test'));

      scrollableHostEl = document.createElement('div');
      scrollableHostEl.style.overflowY = 'scroll';
      scrollableHostEl.style.marginTop = '10px';
      scrollableHostEl.style.width = '500px';
      scrollableHostEl.style.height = '550px';

      boundaryEl = document.createElement('div');
      boundaryEl.style.marginTop = '10px';
      boundaryEl.style.width = '500px';
      boundaryEl.style.height = '600px';

      scrollableHostEl.appendChild(boundaryEl);
      boundaryEl.appendChild(el);
      scrollableHostEl.appendChild(
        createContentEl('800px', 'auto', '#b847ee', 'Scroll me'),
      );

      document.body.insertBefore(
        createContentEl(window.outerHeight + 800 + 'px', 'auto', 'white', ' '),
        document.body.firstChild,
      );
      document.body.insertBefore(scrollableHostEl, document.body.firstChild);
    });

    afterEach(() => {
      for (const vk of vks) {
        vk.destroy();
      }

      boundaryEl.parentElement?.removeChild(boundaryEl);
      scrollableHostEl.parentElement?.removeChild(scrollableHostEl);

      window.scrollTo(0, 0);
    });

    it('should pin an item to the top of its boundary element when scrolled out of view', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          scrollableHost: scrollableHostEl,
          viewportMarginTop: 5,
          setWidth: true,
        }),
      );

      scrollScrollableHost(0, 20);

      // NOTE: All margin tops should be 0 as we ignore the viewport margin when working with
      // a scrollable host.
      validatePinned(el, true, 10, 0);

      // Validate that window scroll moves the pinned viewkeeper once it is pinned
      scrollWindowTo(0, 10);

      validatePinned(el, true, 0, 0);

      scrollWindowTo(0, 0);

      validatePinned(el, true, 10, 0);

      scrollScrollableHost(0, 0);

      validatePinned(el, false);
    });

    it('should set the viewkeeper element`s width when configured to do so', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          setWidth: true,
          scrollableHost: scrollableHostEl,
          viewportMarginTop: 5,
        }),
      );

      scrollScrollableHost(0, 20);

      validatePinned(el, true, 10, 0);

      expect(getComputedStyle(el).width).toBe(
        getComputedStyle(boundaryEl).width,
      );
    });

    it('should not pin an item to the top of its boundary element if it is not visible', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          scrollableHost: scrollableHostEl,
        }),
      );

      el.style.display = 'none';

      scrollScrollableHost(0, 20);

      validatePinned(el, false);
    });

    it('should pin an item under the specified vertical offset element', () => {
      const verticalOffsetEl = document.createElement('div');
      verticalOffsetEl.style.height = '50px';
      verticalOffsetEl.style.backgroundColor = 'blue';

      boundaryEl.insertBefore(verticalOffsetEl, el);

      vks.push(
        new SkyViewkeeper({
          el: verticalOffsetEl,
          boundaryEl,
          scrollableHost: scrollableHostEl,
        }),
      );

      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          verticalOffsetEl,
          scrollableHost: scrollableHostEl,
        }),
      );

      scrollScrollableHost(0, 100);

      validatePinned(verticalOffsetEl, true, 10);
      validatePinned(el, true, 60);

      scrollScrollableHost(0, 0);

      validatePinned(verticalOffsetEl, false);
      validatePinned(el, false);
    });

    it('should destroy the viewkeeper', () => {
      const vk = new SkyViewkeeper({
        el,
        boundaryEl,
        scrollableHost: scrollableHostEl,
        viewportMarginTop: 5,
      });

      // Scroll the parent so that the class list is updated.
      scrollScrollableHost(0, 100);
      expect(Array.from(el.classList)).toEqual(['sky-viewkeeper-fixed']);

      const removeEventListenerSpy = spyOn(
        window,
        'removeEventListener',
      ).and.callThrough();

      vk.destroy();

      // Verify that the viewkeeper class has been removed.
      expect(Array.from(el.classList)).toEqual([]);

      const calls = removeEventListenerSpy.calls.all();
      expect(calls[0].args[0]).toEqual('scroll');
      expect(calls[1].args[0]).toEqual('resize');
      expect(calls[2].args[0]).toEqual('orientationchange');
      removeEventListenerSpy.calls.reset();

      vk.destroy();

      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    it('should clip the viewkeeper element when partially out of view', () => {
      scrollableHostEl.appendChild(
        createContentEl('800px', '600px', '#d3d3d3', 'Below'),
      );

      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          scrollableHost: scrollableHostEl,
          setWidth: true,
        }),
      );

      scrollScrollableHost(0, 20);
      validatePinned(el, true, 10, 0);
      expect(getComputedStyle(el).clipPath).toBe('none');

      scrollScrollableHost(50, 890);
      validatePinned(el, true, -300, 0);
      expect(getComputedStyle(el).clipPath).toBe('inset(310px 0px 0px 50px)');
    });
  });
});
