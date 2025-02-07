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

    function isInViewport(element: Element) {
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
    item1.style.top = '0';
    item1.style.left = '0';
    item1.appendChild(document.createTextNode('Item 1'));
    container.appendChild(item1);

    const item2 = document.createElement('div');
    item2.style.backgroundColor = 'lightgreen';
    item2.style.height = '54px';
    item2.style.width = '100px';
    item2.style.overflow = 'hidden';
    item2.style.position = 'absolute';
    item2.style.top = `${viewportHeight + 50}px`;
    item2.style.left = '0';
    item2.appendChild(document.createTextNode('Item 2'));
    container.appendChild(item2);

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

    await new Promise((resolve) => setTimeout(resolve, 32));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(isInViewport(item1)).toBeTrue();
    validateViewportSpace('top', 50);
    window.scrollTo({
      top: viewportHeight + 50,
      behavior: 'instant',
    });
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(isInViewport(item1)).toBeFalse();
    expect(isInViewport(item2)).toBeTrue();
    validateViewportSpace('top', 54);

    svc.unreserveSpace('item2-test');
    await new Promise((resolve) => requestAnimationFrame(resolve));
    validateViewportSpace('top', 0);
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });
    await new Promise((resolve) => setTimeout(resolve, 32));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(isInViewport(item1)).toBeTrue();
    validateViewportSpace('top', 50);
    svc.unreserveSpace('item1-test');
    await new Promise((resolve) => requestAnimationFrame(resolve));
    validateViewportSpace('top', 0);

    document.body.removeChild(container);
  }));
});
