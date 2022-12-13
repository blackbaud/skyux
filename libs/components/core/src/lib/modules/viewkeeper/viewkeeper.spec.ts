import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkyViewkeeper } from './viewkeeper';

describe('Viewkeeper', () => {
  let boundaryEl: HTMLElement;
  let el: HTMLElement;
  let scrollableHostEl: HTMLElement;
  let vks: SkyViewkeeper[];

  function scrollWindowTo(x: number, y: number) {
    window.scrollTo(x, y);
    SkyAppTestUtility.fireDomEvent(window, 'scroll');
  }

  function scrollScrollableHost(x: number, y: number) {
    scrollableHostEl.scrollTo(x, y);
    SkyAppTestUtility.fireDomEvent(scrollableHostEl, 'scroll');
  }

  function validateElStyle(
    elToValidate: HTMLElement,
    styleProperty: keyof CSSStyleDeclaration,
    expectedValue: any
  ) {
    expect(getComputedStyle(elToValidate)[styleProperty]).toBe(expectedValue);
  }

  function validatePinned(
    elToValidate: HTMLElement,
    pinned: boolean,
    pinnedTop?: number,
    marginTop = 0
  ) {
    if (pinned) {
      validateElStyle(elToValidate, 'position', 'fixed');
      validateElStyle(elToValidate, 'top', pinnedTop + 'px');
      validateElStyle(elToValidate, 'marginTop', marginTop + 'px');
    } else {
      validateElStyle(elToValidate, 'position', 'static');
      validateElStyle(elToValidate, 'top', 'auto');
    }
  }

  function contentEl(
    height: string,
    width: string,
    color: string,
    text: string
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
        })
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
        })
      );

      scrollWindowTo(0, 20);

      validatePinned(el, true, 0, 5);

      expect(getComputedStyle(el).width).toBe(
        getComputedStyle(boundaryEl).width
      );
    });

    it('should not pin an item to the top of its boundary element if it is not visible', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
        })
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
        })
      );

      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          verticalOffsetEl,
        })
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
        'removeEventListener'
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
        '[SkyViewkeeper] The option `el` is required.'
      );
    });

    it('should throw an error if `boundaryEl` not provided', () => {
      expect(() => new SkyViewkeeper({ el })).toThrowError(
        '[SkyViewkeeper] The option `boundaryEl` is required.'
      );
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
        contentEl('800px', 'auto', '#b847ee', 'Scroll me')
      );

      document.body.insertBefore(
        contentEl(window.outerHeight + 800 + 'px', 'auto', 'white', ' '),
        document.body.firstChild
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
        })
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
        })
      );

      scrollScrollableHost(0, 20);

      validatePinned(el, true, 10, 0);

      expect(getComputedStyle(el).width).toBe(
        getComputedStyle(boundaryEl).width
      );
    });

    it('should not pin an item to the top of its boundary element if it is not visible', () => {
      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          scrollableHost: scrollableHostEl,
        })
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
        })
      );

      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          verticalOffsetEl,
          scrollableHost: scrollableHostEl,
        })
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
        'removeEventListener'
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
        contentEl('800px', '600px', '#d3d3d3', 'Below')
      );

      vks.push(
        new SkyViewkeeper({
          el,
          boundaryEl,
          scrollableHost: scrollableHostEl,
          setWidth: true,
        })
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
