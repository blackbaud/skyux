import { TestBed, waitForAsync } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';

import { SkyAppViewportReservedPositionType } from './viewport-reserve-position-type';
import { SkyAppViewportService } from './viewport.service';

describe('Viewport service', () => {
  let svc!: SkyAppViewportService;

  function validateViewportSpace(
    position: SkyAppViewportReservedPositionType,
    size: number,
  ): void {
    expect(
      document.documentElement.style.getPropertyValue(
        `--sky-viewport-${position}`,
      ),
    ).toBe(`${size}px`);
  }

  beforeEach(() => {
    svc = TestBed.inject(SkyAppViewportService);
  });

  it('should return an observable when the content is visible', () => {
    expect(svc.visible instanceof ReplaySubject).toEqual(true);
  });

  it('should reserve and unreserve space', async () => {
    svc.reserveSpace({
      id: 'left-test',
      position: 'left',
      size: 20,
    });

    svc.reserveSpace({
      id: 'top-test',
      position: 'top',
      size: 30,
    });

    svc.reserveSpace({
      id: 'right-test',
      position: 'right',
      size: 40,
    });

    svc.reserveSpace({
      id: 'bottom-test',
      position: 'bottom',
      size: 50,
    });

    await new Promise((resolve) => requestAnimationFrame(resolve));
    validateViewportSpace('left', 20);
    validateViewportSpace('top', 30);
    validateViewportSpace('right', 40);
    validateViewportSpace('bottom', 50);

    svc.unreserveSpace('left-test');
    svc.unreserveSpace('top-test');
    svc.unreserveSpace('right-test');
    svc.unreserveSpace('bottom-test');

    await new Promise((resolve) => requestAnimationFrame(resolve));
    validateViewportSpace('left', 0);
    validateViewportSpace('top', 0);
    validateViewportSpace('right', 0);
    validateViewportSpace('bottom', 0);
  });

  it('should reserve and unreserve space for elements that scroll out of view', waitForAsync(async () => {
    const viewportHeight = window.innerHeight;

    expect(viewportHeight).toBeGreaterThan(50);

    function isInViewport(element: Element): boolean {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    }

    const container = document.createElement('div');
    container.style.height = '200vh';
    container.style.position = 'relative';
    container.style.marginTop = '20px';
    container.appendChild(document.createTextNode('Scroll down'));

    const item1 = document.createElement('div');
    item1.style.backgroundColor = 'lightblue';
    item1.style.height = '50px';
    item1.style.width = '100px';
    item1.style.overflow = 'hidden';
    item1.style.position = 'absolute';
    item1.style.top = '40px';
    item1.style.left = '0';
    item1.appendChild(document.createTextNode('Item 1'));
    container.appendChild(item1);

    const item2 = document.createElement('div');
    // eslint-disable-next-line @cspell/spellchecker
    item2.style.backgroundColor = 'lightgreen';
    item2.style.height = '54px';
    item2.style.width = '100px';
    item2.style.overflow = 'hidden';
    item2.style.position = 'absolute';
    item2.style.top = `${viewportHeight + 50}px`;
    item2.style.left = '0';
    item2.appendChild(document.createTextNode('Item 2'));
    container.appendChild(item2);

    const item3 = document.createElement('div');
    item3.style.backgroundColor = 'lch(73% 48% 326deg)';
    item3.style.height = '40px';
    item3.style.width = '120px';
    item3.style.overflow = 'hidden';
    item3.style.position = 'fixed';
    item3.style.top = '0';
    item3.style.left = '40px';
    item3.style.zIndex = '10';
    const item3Child = document.createElement('div');
    item3Child.style.height = '100%';
    item3Child.style.width = '100%';
    item3Child.style.margin = '0';
    item3Child.appendChild(document.createTextNode('Item 3'));
    item3.appendChild(item3Child);
    container.appendChild(item3);

    document.body.appendChild(container);

    svc.reserveSpace({
      id: 'item1-test',
      position: 'top',
      size: 50,
      reserveForElement: item1,
    });

    svc.reserveSpace({
      id: 'item2-test',
      position: 'top',
      size: 54,
      reserveForElement: item2,
    });

    svc.reserveSpace({
      id: 'item3-test',
      position: 'top',
      size: 40,
      reserveForElement: item3,
    });

    await new Promise((resolve) => setTimeout(resolve, 32));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(isInViewport(item1)).toBeTrue();
    validateViewportSpace('top', 90);
    window.scrollTo({
      top: viewportHeight + 50,
      behavior: 'instant',
    });
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(isInViewport(item1)).toBeFalse();
    expect(isInViewport(item2)).toBeTrue();
    validateViewportSpace('top', 94);

    svc.unreserveSpace('item2-test');
    await new Promise((resolve) => requestAnimationFrame(resolve));
    validateViewportSpace('top', 40);
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });
    await new Promise((resolve) => setTimeout(resolve, 32));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(isInViewport(item1)).toBeTrue();
    validateViewportSpace('top', 90);
    svc.unreserveSpace('item1-test');
    await new Promise((resolve) => requestAnimationFrame(resolve));
    validateViewportSpace('top', 40);

    document.body.removeChild(container);
  }));

  it('should reserve space for elements underneath a progressbar element', waitForAsync(async () => {
    const viewportHeight = window.innerHeight;

    expect(viewportHeight).toBeGreaterThan(50);

    const container = document.createElement('div');
    container.style.height = 'calc(100vh - 20px)';
    container.style.position = 'relative';
    container.style.marginTop = '20px';
    container.appendChild(document.createTextNode('Container'));

    const item1 = document.createElement('div');
    item1.style.backgroundColor = 'lightblue';
    item1.style.height = '50px';
    item1.style.width = '100px';
    item1.style.overflow = 'hidden';
    item1.style.position = 'absolute';
    item1.style.top = '0px';
    item1.style.left = '0';
    item1.style.zIndex = '1';
    item1.appendChild(document.createTextNode('Item 1'));
    container.appendChild(item1);

    const item2 = document.createElement('div');
    item2.style.backgroundColor = 'oklch(87% 28% 74deg)';
    item2.style.height = '60px';
    item2.style.width = '100px';
    item2.style.overflow = 'hidden';
    item2.style.position = 'absolute';
    item2.style.top = '50px';
    item2.style.left = '0';
    item2.style.zIndex = '1';
    item2.appendChild(document.createTextNode('Item 2'));
    container.appendChild(item2);

    const progressbar = document.createElement('div');
    progressbar.setAttribute('role', 'progressbar');
    // eslint-disable-next-line @cspell/spellchecker
    progressbar.style.backgroundColor = 'lightgreen';
    progressbar.style.height = '100px';
    progressbar.style.width = '100px';
    progressbar.style.overflow = 'hidden';
    progressbar.style.position = 'absolute';
    progressbar.style.top = `0`;
    progressbar.style.left = '0';
    progressbar.style.opacity = '0.4';
    progressbar.style.zIndex = '10';
    progressbar.appendChild(document.createTextNode('Loading...'));
    container.appendChild(progressbar);

    document.body.appendChild(container);

    svc.reserveSpace({
      id: 'item1-test',
      position: 'top',
      size: 50,
      reserveForElement: item1,
    });

    svc.reserveSpace({
      id: 'item2-test',
      position: 'top',
      size: 60,
      reserveForElement: item2,
    });

    await new Promise((resolve) => setTimeout(resolve, 32));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    validateViewportSpace('top', 110);

    document.body.removeChild(container);
  }));

  it("should reserve space for elements underneath an overlay if it's still in the viewport", waitForAsync(async () => {
    const viewportHeight = window.innerHeight;

    expect(viewportHeight).toBeGreaterThan(50);

    const container = document.createElement('div');
    container.style.height = '100vh';
    container.style.width = '100vw';
    container.style.position = 'relative';
    container.style.marginTop = '20px';
    container.appendChild(document.createTextNode('Container'));

    const item1 = document.createElement('div');
    item1.style.backgroundColor = 'lightblue';
    item1.style.height = '50px';
    item1.style.width = '100px';
    item1.style.overflow = 'hidden';
    item1.style.position = 'absolute';
    item1.style.top = '40px';
    item1.style.right = '0';
    item1.style.zIndex = '1';
    item1.appendChild(document.createTextNode('Item 1'));
    container.appendChild(item1);

    const item2 = document.createElement('div');
    item2.style.backgroundColor = 'oklch(87% 53% 155deg)';
    item2.style.height = '50px';
    item2.style.width = '100px';
    item2.style.overflow = 'hidden';
    item2.style.position = 'absolute';
    item2.style.bottom = '20px';
    item2.style.left = '0';
    item2.style.zIndex = '1';
    item2.appendChild(document.createTextNode('Item 2'));
    container.appendChild(item2);

    const item3 = document.createElement('div');
    item3.style.backgroundColor = 'oklch(67% 62% 358deg)';
    item3.style.height = '50px';
    item3.style.width = '100px';
    item3.style.overflow = 'hidden';
    item3.style.position = 'absolute';
    item3.style.top = '40px';
    item3.style.left = '10px';
    item3.style.zIndex = '1';
    item3.appendChild(document.createTextNode('Item 2'));
    container.appendChild(item3);

    const overlay = document.createElement('div');
    // eslint-disable-next-line @cspell/spellchecker
    overlay.style.backgroundColor = 'lightgreen';
    overlay.style.height = '100vh';
    overlay.style.width = '100vw';
    overlay.style.overflow = 'hidden';
    overlay.style.position = 'absolute';
    overlay.style.top = `0`;
    overlay.style.left = '0';
    overlay.style.opacity = '0.4';
    overlay.style.zIndex = '10';
    overlay.appendChild(document.createTextNode('Mask'));
    container.appendChild(overlay);

    document.body.appendChild(container);

    svc.reserveSpace({
      id: 'item1-test',
      position: 'right',
      size: 100,
      reserveForElement: item1,
    });

    svc.reserveSpace({
      id: 'item2-test',
      position: 'bottom',
      size: 70,
      reserveForElement: item2,
    });

    svc.reserveSpace({
      id: 'item3-test',
      position: 'left',
      size: 110,
      reserveForElement: item3,
    });

    await new Promise((resolve) => setTimeout(resolve, 32));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    validateViewportSpace('right', 100);
    validateViewportSpace('bottom', 70);
    validateViewportSpace('left', 110);

    document.body.removeChild(container);
  }));

  it('should not reserve space for elements with zero width', waitForAsync(async () => {
    const container = document.createElement('div');
    container.style.height = '100vh';
    container.style.position = 'relative';
    container.appendChild(document.createTextNode('Container'));

    const zeroWidthElement = document.createElement('div');
    zeroWidthElement.style.backgroundColor = 'lightblue';
    zeroWidthElement.style.height = '50px';
    zeroWidthElement.style.width = '0';
    zeroWidthElement.style.overflow = 'hidden';
    zeroWidthElement.style.position = 'absolute';
    zeroWidthElement.style.top = '40px';
    zeroWidthElement.style.left = '0';
    zeroWidthElement.appendChild(document.createTextNode('Zero Width'));
    container.appendChild(zeroWidthElement);

    document.body.appendChild(container);

    svc.reserveSpace({
      id: 'zero-width-test',
      position: 'top',
      size: 50,
      reserveForElement: zeroWidthElement,
    });

    await new Promise((resolve) => setTimeout(resolve, 32));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // Should not reserve space because element has zero width
    validateViewportSpace('top', 0);

    svc.unreserveSpace('zero-width-test');
    document.body.removeChild(container);
  }));

  it('should not reserve space for elements with zero height', waitForAsync(async () => {
    const container = document.createElement('div');
    container.style.height = '100vh';
    container.style.position = 'relative';
    container.appendChild(document.createTextNode('Container'));

    const zeroHeightElement = document.createElement('div');
    zeroHeightElement.style.backgroundColor = 'lightblue';
    zeroHeightElement.style.height = '0';
    zeroHeightElement.style.width = '100px';
    zeroHeightElement.style.overflow = 'hidden';
    zeroHeightElement.style.position = 'absolute';
    zeroHeightElement.style.top = '40px';
    zeroHeightElement.style.left = '0';
    zeroHeightElement.appendChild(document.createTextNode('Zero Height'));
    container.appendChild(zeroHeightElement);

    document.body.appendChild(container);

    svc.reserveSpace({
      id: 'zero-height-test',
      position: 'left',
      size: 100,
      reserveForElement: zeroHeightElement,
    });

    await new Promise((resolve) => setTimeout(resolve, 32));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // Should not reserve space because element has zero height
    validateViewportSpace('left', 0);

    svc.unreserveSpace('zero-height-test');
    document.body.removeChild(container);
  }));
});
