
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed
} from '@angular/core/testing';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyBackToTopFixtureComponent
} from './fixtures/back-to-top.component.fixture';

import {
  SkyBackToTopFixturesModule
} from './fixtures/back-to-top.module.fixture';

//#region helpers
function scrollWindowToBottom(fixture: ComponentFixture<any>): void {
  window.scrollTo(0, document.body.scrollHeight);
  SkyAppTestUtility.fireDomEvent(window, 'scroll');
  fixture.detectChanges();
}

function scrollWindowTop(fixture: ComponentFixture<any>): void {
  window.scrollTo(0, 0);
  SkyAppTestUtility.fireDomEvent(window, 'scroll');
  fixture.detectChanges();
}

function getBackToTop(): HTMLElement {
  return document.querySelector('.sky-back-to-top');
}

function getBackToTopButton(): HTMLElement {
  return document.querySelector('.sky-back-to-top button');
}

function clickBackToTopButton(fixture: ComponentFixture<any>): void {
  getBackToTopButton().click();
  fixture.detectChanges();
}

function getBackToTopTarget(): HTMLElement {
  return document.querySelector('#back-to-top-target');
}

function isElementInView(element: HTMLElement): boolean {
  const elementRect = element.getBoundingClientRect();
  return (elementRect.top >= 0) && (elementRect.bottom <= window.innerHeight);
}

function scrollElement(
  element: HTMLElement,
  yDistance: number,
  fixture: ComponentFixture<any>
): void {
  element.scrollTop = yDistance;
  SkyAppTestUtility.fireDomEvent(element, 'scroll');
  fixture.detectChanges();
}
//#endregion

describe('back to top component', () => {
  let fixture: ComponentFixture<SkyBackToTopFixtureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyBackToTopFixturesModule
      ]
    });

    fixture = TestBed.createComponent(SkyBackToTopFixtureComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('when parent is window', () => {
    it('should show when backToTopTarget is defined and the target element is scrolled out of view', fakeAsync(() => {
      scrollWindowToBottom(fixture);

      const backToTopElement = getBackToTop();
      expect(backToTopElement).not.toBeNull();
    }));

    it('should not show when user scrolls back to the top', fakeAsync(() => {
      scrollWindowToBottom(fixture);

      let backToTopElement = getBackToTop();
      expect(backToTopElement).not.toBeNull();

      scrollWindowTop(fixture);

      backToTopElement = getBackToTop();
      expect(backToTopElement).toBeNull();
    }));

    it('should scroll to target element when back to top button is clicked', fakeAsync(() => {
      fixture.detectChanges();
      scrollWindowToBottom(fixture);
      const backToTopTarget = getBackToTopTarget();

      expect(isElementInView(backToTopTarget)).toBe(false);

      clickBackToTopButton(fixture);

      expect(isElementInView(backToTopTarget)).toBe(true);
    }));
  });

  describe('when parent is scrollable element', () => {
    let parentElement: HTMLElement;

    beforeEach(() => {
      fixture.componentInstance.height = 200;
      fixture.componentInstance.scrollableParent = true;
      fixture.detectChanges();
      parentElement = document.querySelector('#back-to-top-parent') as HTMLElement;
    });

    it('should show when backToTopTarget is defined and the target element is scrolled out of view', fakeAsync(() => {
      scrollElement(parentElement, 999, fixture);
      const backToTopElement = getBackToTop();

      expect(backToTopElement).not.toBeNull();
    }));

    it('should not show when user scrolls back to the top', fakeAsync(() => {
      scrollElement(parentElement, 999, fixture);
      let backToTopElement = getBackToTop();
      expect(backToTopElement).not.toBeNull();

      scrollElement(parentElement, 0, fixture);
      backToTopElement = getBackToTop();

      expect(backToTopElement).toBeNull();
    }));

    it('should scroll to target element when back to top button is clicked', async(() => {
      scrollElement(parentElement, 999, fixture);
      const backToTopTarget = getBackToTopTarget();

      expect(isElementInView(backToTopTarget)).toBe(false);

      clickBackToTopButton(fixture);

      expect(isElementInView(backToTopTarget)).toBe(true);
    }));
  });
});
