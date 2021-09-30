
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed
} from '@angular/core/testing';

import {
  Subject
} from 'rxjs';

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

import {
  SkyBackToTopMessage
} from './models/back-to-top-message';

import {
  SkyBackToTopMessageType
} from './models/back-to-top-message-type';

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

    it('should show the button if the user is already scrolled and buttonHidden changes to false', () => {
      fixture.componentInstance.backToTopOptions = { buttonHidden: true };
      fixture.detectChanges();

      scrollWindowToBottom(fixture);

      expect(getBackToTop()).toBeNull();

      fixture.componentInstance.backToTopOptions = { buttonHidden: false };
      fixture.detectChanges();

      expect(getBackToTop()).not.toBeNull();
    });

    it('should show the button if the user is already scrolled and buttonHidden changes to true', () => {
      fixture.componentInstance.backToTopOptions = { buttonHidden: false };
      fixture.detectChanges();

      scrollWindowToBottom(fixture);

      expect(getBackToTop()).not.toBeNull();

      fixture.componentInstance.backToTopOptions = { buttonHidden: true };
      fixture.detectChanges();

      expect(getBackToTop()).toBeNull();
    });

    it('should default buttonHidden to false if the options are not defined', () => {
      fixture.componentInstance.backToTopOptions = undefined;
      fixture.detectChanges();

      scrollWindowToBottom(fixture);

      expect(getBackToTop()).not.toBeNull();
    });
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

  describe('when the message stream is used', () => {
    it('should scroll to target element when a BackToTop message is sent', () => {
      fixture.detectChanges();
      scrollWindowToBottom(fixture);
      const backToTopTarget = getBackToTopTarget();

      expect(isElementInView(backToTopTarget)).toBe(false);

      fixture.componentInstance.backToTopController.next({ type: SkyBackToTopMessageType.BackToTop });

      expect(isElementInView(backToTopTarget)).toBe(true);
    });

    it('unsubscribes from old back to top subscription streams', () => {
      const newStream = new Subject<SkyBackToTopMessage>();
      const oldStream = fixture.componentInstance.backToTopController;
      spyOn(oldStream, 'unsubscribe');

      fixture.componentInstance.backToTopController = newStream;
      fixture.detectChanges();

      expect(oldStream.unsubscribe).toHaveBeenCalled();
    });
  });
});
