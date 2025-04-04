import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  SkyAppTestUtility,
  SkyAppTestUtilityDomEventOptions,
  expect,
  expectAsync,
} from '@skyux-sdk/testing';
import { SkyLiveAnnouncerService } from '@skyux/core';

import { SkyWaitFixturesModule } from './fixtures/wait-fixtures.module';
import { SkyWaitTestComponent } from './fixtures/wait.component.fixture';
import { SkyWaitAdapterService } from './wait-adapter.service';
import { SkyWaitComponent } from './wait.component';

describe('Wait component', () => {
  function fireDomEvent(
    element: Element | null,
    eventName: string,
    options?: SkyAppTestUtilityDomEventOptions,
  ): void {
    if (element) {
      SkyAppTestUtility.fireDomEvent(element, eventName, options);
    }
  }

  function getAriaLabel(): string | undefined {
    return (
      document.body
        .querySelector('.sky-wait-mask')
        ?.getAttribute('aria-label') || undefined
    );
  }

  function testScreenReaderAnnouncements(
    fixture: ComponentFixture<SkyWaitTestComponent>,
    customValues: boolean,
    ariaLabel: string,
    completedText: string,
    isFullPage = false,
    isNonBlocking = false,
  ): void {
    if (customValues) {
      fixture.componentInstance.ariaLabel = ariaLabel;
      fixture.componentInstance.screenReaderCompletedText = completedText;
    }
    fixture.componentInstance.isNonBlocking = isNonBlocking;
    fixture.componentInstance.isFullPage = isFullPage;
    fixture.componentInstance.isWaiting = true;
    expect(liveAnnouncerSpy).not.toHaveBeenCalled();
    fixture.detectChanges();

    expect(liveAnnouncerSpy).toHaveBeenCalledOnceWith(ariaLabel);
    liveAnnouncerSpy.calls.reset();

    fixture.componentInstance.isWaiting = false;
    fixture.detectChanges();

    expect(liveAnnouncerSpy).toHaveBeenCalledOnceWith(completedText);
    liveAnnouncerSpy.calls.reset();
  }

  let liveAnnouncer: SkyLiveAnnouncerService;
  let liveAnnouncerSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyWaitFixturesModule],
    });
    // The spy is set up in the `beforeEach` because `announce` is async. Setting the spy here allows us to not worry about timers and is stubbing out functionality we don't care about for unit testing.
    liveAnnouncer = TestBed.inject(SkyLiveAnnouncerService);
    liveAnnouncerSpy = spyOn(liveAnnouncer, 'announce').and.stub();
  });

  describe('basic behavior', () => {
    it('should show the wait element when isWaiting is set to true', async () => {
      const fixture = TestBed.createComponent(SkyWaitComponent);
      fixture.detectChanges();

      const el = fixture.nativeElement;
      expect(el.querySelector('.sky-wait')).toBeNull();

      fixture.componentInstance.isWaiting = true;
      fixture.detectChanges();

      expect(el.querySelector('.sky-wait')).not.toBeNull();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should set relative position on the wait component parent element', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isWaiting = true;
      fixture.detectChanges();

      const el = fixture.nativeElement;

      expect(el.querySelector('.sky-wait-test-component')).toHaveCssClass(
        'sky-wait-element-active',
      );
      expect(
        el.querySelector('.sky-wait-mask-loading-blocking'),
      ).not.toBeNull();

      fixture.componentInstance.isWaiting = false;
      fixture.detectChanges();

      expect(el.querySelector('.sky-wait-test-component')).not.toHaveCssClass(
        'sky-wait-element-active',
      );
    });

    it('should set the appropriate class when wait component fullPage is set to true', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isFullPage = true;
      fixture.componentInstance.isWaiting = true;
      fixture.detectChanges();

      const el = fixture.nativeElement;

      expect(el.querySelector('.sky-wait-mask-loading-fixed')).not.toBeNull();
      expect(el.querySelector('.sky-wait-test-component').style.position).toBe(
        '',
      );

      fixture.componentInstance.isWaiting = false;
      fixture.detectChanges();

      expect(el.querySelector('.sky-wait-test-component').style.position).toBe(
        '',
      );
      expect(el.querySelector('.sky-wait')).toBeNull();

      fixture.componentInstance.isWaiting = true;
      fixture.componentInstance.isFullPage = false;
      fixture.detectChanges();

      expect(el.querySelector('.sky-wait-mask-loading-fixed')).toBeNull();
      expect(el.querySelector('.sky-wait-test-component')).toHaveCssClass(
        'sky-wait-element-active',
      );
    });

    it('should set the appropriate class when nonBlocking is set to true', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isNonBlocking = true;
      fixture.componentInstance.isWaiting = true;
      fixture.detectChanges();

      const el = fixture.nativeElement;

      expect(
        el.querySelector('.sky-wait-mask-loading-non-blocking'),
      ).not.toBeNull();

      fixture.componentInstance.isNonBlocking = true;
      fixture.detectChanges();

      expect(el.querySelector('.sky-wait-mask-loading-blocking')).toBeNull();
    });

    it('should not block a menu overlay', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isWaiting = true;
      fixture.componentInstance.showMenuOverlay = true;
      fixture.detectChanges();

      const el = fixture.nativeElement;

      const mask: HTMLElement | undefined = el.querySelector(
        '.sky-wait-mask-loading-blocking',
      );
      const menu: Element | null = el.querySelector('.menu-overlay');
      expect(mask).toBeTruthy();
      expect(menu).toBeTruthy();
      const boundingBox = mask?.getBoundingClientRect();
      expect(boundingBox).toBeTruthy();
      expect(document.elementFromPoint(boundingBox!.x, boundingBox!.y)).toBe(
        menu,
      );

      fixture.componentInstance.showMenuOverlay = false;
      fixture.detectChanges();

      expect(document.elementFromPoint(boundingBox!.x, boundingBox!.y)).toBe(
        mask as Element,
      );
    });
  });

  describe('keyboard navigation', () => {
    it('should prevent tab navigation and focus when fullPage is true', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isNonBlocking = false;
      fixture.componentInstance.isFullPage = true;
      fixture.componentInstance.isWaiting = true;
      fixture.detectChanges();

      const bodyFocusSpy = spyOn(document.body, 'focus').and.callThrough();

      fireDomEvent(document.body, 'keydown', {
        keyboardEventInit: {
          key: 'tab',
        },
      });

      expect(document.activeElement).toBe(document.body);
      expect(bodyFocusSpy).toHaveBeenCalledTimes(1);

      const anchor2 = document.body.querySelector('#anchor-2');

      fixture.componentInstance.secondWaitIsWaiting = true;
      fixture.detectChanges();

      fireDomEvent(anchor2, 'focusin', {
        customEventInit: {
          relatedTarget: document.body,
        },
      });

      expect(document.activeElement).toBe(document.body);
    });

    it(`should allow tab navigation and focus after a fullPage wait is removed when another non-blocking wait still exists and both waits were added at the same time`, fakeAsync(() => {
      // NOTE: This test was added due to a race condition with two quickly added waits on load
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.detectChanges();

      fixture.componentInstance.startBlockingWait();
      fixture.componentInstance.startNonBlockingWait();
      fixture.detectChanges();

      const bodyFocusSpy = spyOn(document.body, 'focus').and.callThrough();

      fireDomEvent(document.body, 'keydown', {
        keyboardEventInit: {
          key: 'tab',
        },
      });

      tick();
      fixture.detectChanges();

      expect(bodyFocusSpy).toHaveBeenCalledTimes(1);

      const anchor2 = document.body.querySelector('#anchor-2');

      fireDomEvent(anchor2, 'focusin', {
        customEventInit: {
          relatedTarget: document.body,
        },
      });
      fixture.detectChanges();

      expect(document.activeElement).toBe(document.body);

      fixture.componentInstance.endBlockingWait();
      tick();
      fixture.detectChanges();

      fireDomEvent(document.body, 'keydown', {
        keyboardEventInit: {
          key: 'tab',
        },
      });

      fixture.detectChanges();
      expect(bodyFocusSpy).toHaveBeenCalledTimes(1);

      fireDomEvent(anchor2, 'focusin', {
        customEventInit: {
          relatedTarget: document.body,
        },
      });
      fixture.detectChanges();

      expect(document.activeElement).toBe(document.body);

      // Clean up the existing wait so that there are not test side effects for other tests.
      fixture.componentInstance.endNonBlockingWait();
      tick();
    }));

    it('should propagate tab navigation forward and backward avoiding waited element', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isNonBlocking = false;
      fixture.componentInstance.isFullPage = false;
      fixture.componentInstance.isWaiting = true;

      fixture.detectChanges();

      const waitButton = document.body.querySelector('#inside-button');
      const anchor0 = document.body.querySelector('#anchor-0') as HTMLElement;
      const anchor1 = document.body.querySelector('#anchor-1') as HTMLElement;
      const anchor2 = document.body.querySelector('#anchor-2') as HTMLElement;

      anchor1.focus();
      fireDomEvent(waitButton, 'focusin', {
        customEventInit: {
          relatedTarget: anchor1,
        },
      });

      expect(document.activeElement).toBe(anchor2);

      anchor2.focus();
      fireDomEvent(waitButton, 'focusin', {
        customEventInit: {
          relatedTarget: anchor2,
        },
      });

      expect(document.activeElement).toBe(anchor1);

      // Wrapping navigation
      fixture.componentInstance.showAnchor0 = true;
      fixture.componentInstance.showAnchor2 = false;
      fixture.detectChanges();

      anchor1.focus();
      fireDomEvent(waitButton, 'focusin', {
        customEventInit: {
          relatedTarget: anchor1,
        },
      });

      expect(document.activeElement).toBe(anchor0);

      // Invisible elements
      // test display:none
      fixture.componentInstance.showAnchor0 = true;
      fixture.componentInstance.showAnchor2 = true;
      fixture.componentInstance.anchor2Display = 'none';
      fixture.detectChanges();

      anchor1.focus();
      fireDomEvent(waitButton, 'focusin', {
        customEventInit: {
          relatedTarget: anchor1,
        },
      });

      expect(document.activeElement).toBe(anchor0);

      // test display:none
      fixture.componentInstance.showAnchor0 = true;
      fixture.componentInstance.showAnchor2 = true;
      fixture.componentInstance.anchor2Display = '';
      fixture.componentInstance.anchor2Visibility = 'hidden';
      fixture.detectChanges();

      anchor1.focus();
      fireDomEvent(waitButton, 'focusin', {
        customEventInit: {
          relatedTarget: anchor1,
        },
      });

      expect(document.activeElement).toBe(anchor0);

      fixture.componentInstance.showAnchor0 = true;
      fixture.componentInstance.showAnchor2 = true;
      fixture.componentInstance.anchor0Visibility = 'hidden';
      fixture.componentInstance.anchor2Display = 'none';
      fixture.detectChanges();

      anchor1.focus();
      fireDomEvent(waitButton, 'focusin', {
        customEventInit: {
          relatedTarget: anchor1,
        },
      });

      expect(document.activeElement).toBe(anchor1);

      fixture.componentInstance.showAnchor0 = false;
      fixture.componentInstance.showAnchor2 = false;
      fixture.detectChanges();

      anchor1.focus();
      fireDomEvent(waitButton, 'focusin', {
        customEventInit: {
          relatedTarget: anchor1,
        },
      });

      expect(document.activeElement).toBe(anchor1);

      fixture.componentInstance.isWaiting = false;
      fixture.detectChanges();

      anchor1.focus();
      fireDomEvent(waitButton, 'focusin', {
        customEventInit: {
          relatedTarget: anchor1,
        },
      });

      expect(document.activeElement).toBe(anchor1);
    });

    it('should ignore other blocking wait when propagating tab navigation', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.detectChanges();

      fixture.componentInstance.isNonBlocking = false;
      fixture.componentInstance.isFullPage = false;
      fixture.detectChanges();

      fixture.componentInstance.isWaiting = true;
      fixture.componentInstance.secondWaitIsWaiting = true;
      fixture.detectChanges();

      const waitButton = document.body.querySelector('#inside-button');
      const anchor0 = document.body.querySelector('#anchor-0') as HTMLElement;
      const anchor1 = document.body.querySelector('#anchor-1') as HTMLElement;

      anchor1.focus();
      fireDomEvent(waitButton, 'focusin', {
        customEventInit: {
          relatedTarget: anchor1,
        },
      });

      expect(document.activeElement).toBe(anchor0);
    });

    it('should set isPageWaitActive when fullPage is true', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isNonBlocking = false;
      fixture.componentInstance.isFullPage = true;
      fixture.componentInstance.isWaiting = true;
      fixture.detectChanges();

      expect(SkyWaitAdapterService.isPageWaitActive).toBeTruthy();

      fixture.componentInstance.isWaiting = false;
      fixture.detectChanges();

      expect(SkyWaitAdapterService.isPageWaitActive).toBeFalsy();
    });
  });

  describe('focus', () => {
    it('should restore focus', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);

      const button = document.getElementById('inside-button');
      button?.focus();

      fixture.componentInstance.isWaiting = true;
      fixture.componentInstance.isNonBlocking = false;
      fixture.detectChanges();

      expect(document.activeElement).not.toBe(button);

      fixture.componentInstance.isWaiting = false;
      fixture.detectChanges();

      expect(document.activeElement).toBe(button);
    });

    it('should not restore focus if focus is changed', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);

      const button = document.getElementById('inside-button');
      button?.focus();

      fixture.componentInstance.isWaiting = true;
      fixture.componentInstance.isNonBlocking = false;
      fixture.detectChanges();

      expect(document.activeElement).not.toBe(button);

      document.getElementById('anchor-1')?.focus();

      fixture.componentInstance.isWaiting = false;
      fixture.detectChanges();

      expect(document.activeElement).not.toBe(button);
    });
  });

  describe('accessibility', () => {
    it('should set aria-busy on document body when fullPage is true', async () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isFullPage = true;
      fixture.componentInstance.isWaiting = true;
      fixture.detectChanges();

      expect(document.body.getAttribute('aria-busy')).toBe('true');

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.componentInstance.isWaiting = false;
      fixture.detectChanges();

      expect(document.body.getAttribute('aria-busy')).toBeNull();
    });

    it('should set aria-busy on containing div when fullPage is set to false', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isWaiting = true;
      fixture.detectChanges();

      const el = fixture.nativeElement;

      expect(
        el.querySelector('.sky-wait-test-component').getAttribute('aria-busy'),
      ).toBe('true');

      fixture.componentInstance.isWaiting = false;
      fixture.detectChanges();

      expect(
        el.querySelector('.sky-wait-test-component').getAttribute('aria-busy'),
      ).toBeNull();
    });

    it('should use aria-label', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.ariaLabel = 'test label';
      fixture.componentInstance.isNonBlocking = false;
      fixture.componentInstance.isWaiting = true;
      fixture.detectChanges();

      expect(getAriaLabel()).toBe('test label');
    });

    it('should respect changes to aria-label after the component is rendered', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.ariaLabel = 'test label';
      fixture.componentInstance.isNonBlocking = false;
      fixture.componentInstance.isWaiting = true;
      fixture.detectChanges();

      expect(getAriaLabel()).toBe('test label');

      fixture.componentInstance.ariaLabel = 'another test label';
      fixture.detectChanges();

      expect(getAriaLabel()).toBe('another test label');
    });

    it('should set aria-label on document body when fullPage is true and is blocking', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isFullPage = true;
      fixture.componentInstance.isWaiting = true;
      fixture.componentInstance.isNonBlocking = false;
      fixture.detectChanges();

      expect(getAriaLabel()).toBe('Page loading. Please wait.');
    });

    it('should set aria-label on document body when fullPage is true and is not blocking', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isFullPage = true;
      fixture.componentInstance.isWaiting = true;
      fixture.componentInstance.isNonBlocking = true;
      fixture.detectChanges();

      expect(getAriaLabel()).toBe('Page loading.');
    });

    it('should set aria-label on containing div when fullPage is set to false and is blocking', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isFullPage = false;
      fixture.componentInstance.isWaiting = true;
      fixture.componentInstance.isNonBlocking = false;
      fixture.detectChanges();

      expect(getAriaLabel()).toBe('Loading. Please wait.');
    });

    it('should set aria-label on containing div when fullPage is set to false and is not blocking', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isFullPage = false;
      fixture.componentInstance.isWaiting = true;
      fixture.componentInstance.isNonBlocking = true;
      fixture.detectChanges();

      expect(getAriaLabel()).toBe('Loading.');
    });

    it('should not use default aria-label when one is provided', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isFullPage = false;
      fixture.componentInstance.isWaiting = true;
      fixture.componentInstance.isNonBlocking = false;
      fixture.componentInstance.ariaLabel = 'Waiting for the page to load.';
      fixture.detectChanges();

      expect(getAriaLabel()).toBe('Waiting for the page to load.');
    });

    it('should update aria-label with default when fullPage or isNonBlocking is updated', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isWaiting = true;
      fixture.detectChanges();

      expect(getAriaLabel()).toBe('Loading. Please wait.');

      fixture.componentInstance.isFullPage = true;
      fixture.detectChanges();

      expect(getAriaLabel()).toBe('Page loading. Please wait.');

      fixture.componentInstance.isNonBlocking = true;
      fixture.detectChanges();

      expect(getAriaLabel()).toBe('Page loading.');
    });

    it('should announce the ariaLabel when loading begins and the screenReaderCompletedText when it ends to screen readers', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);

      testScreenReaderAnnouncements(
        fixture,
        true,
        'test label',
        'test completed text',
      );
    });

    it('should respect changes to ariaLabel and screenReaderCompletedText for screen readers after the component has rendered', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);

      testScreenReaderAnnouncements(
        fixture,
        true,
        'test label',
        'test completed text',
      );

      fixture.componentInstance.isWaiting = false;
      fixture.detectChanges();

      testScreenReaderAnnouncements(
        fixture,
        true,
        'test label 2',
        'test completed text 2',
      );
    });

    it('should announce the default ariaLabel and screenReaderCompletedText when fullPage is true and is blocking', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);

      testScreenReaderAnnouncements(
        fixture,
        false,
        'Page loading. Please wait.',
        'Page loading complete.',
        true,
      );
    });

    it('should announce the default ariaLabel and screenReaderCompletedText when fullPage is true and is not blocking', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);

      testScreenReaderAnnouncements(
        fixture,
        false,
        'Page loading.',
        'Page loading complete.',
        true,
        true,
      );
    });

    it('should announce the default ariaLabel and screenReaderCompletedText when fullPage is false and is blocking', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);

      testScreenReaderAnnouncements(
        fixture,
        false,
        'Loading. Please wait.',
        'Loading complete.',
      );
    });

    it('should announce the default ariaLabel and screenReaderCompletedText when fullPage is false and is not blocking', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);

      testScreenReaderAnnouncements(
        fixture,
        false,
        'Loading.',
        'Loading complete.',
        false,
        true,
      );
    });

    it('should update ariaLabel and screenReaderCompletedText defaults when conditions are updated', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);

      testScreenReaderAnnouncements(
        fixture,
        false,
        'Page loading.',
        'Page loading complete.',
        true,
        true,
      );

      testScreenReaderAnnouncements(
        fixture,
        false,
        'Loading. Please wait.',
        'Loading complete.',
      );
    });

    /**
     * NOTE: The `region` rule is turned off as our karma tests do not set up regions within the `body`.
     */

    it('should be accessible when using a full page blocking wait', async () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isFullPage = true;
      fixture.componentInstance.isWaiting = true;
      fixture.componentInstance.isNonBlocking = false;
      fixture.detectChanges();

      await expectAsync(document.body).toBeAccessible({
        rules: {
          region: {
            enabled: false,
          },
        },
      });
    });

    it('should be accessible when using a full page non-blocking wait', async () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isFullPage = true;
      fixture.componentInstance.isWaiting = true;
      fixture.componentInstance.isNonBlocking = true;
      fixture.detectChanges();

      await expectAsync(document.body).toBeAccessible({
        rules: {
          region: {
            enabled: false,
          },
        },
      });
    });

    it('should be accessible when using a full page blocking element', async () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isFullPage = false;
      fixture.componentInstance.isWaiting = true;
      fixture.componentInstance.isNonBlocking = false;
      fixture.detectChanges();

      // TODO: Reenable rule once work for new format title is done and an a11y label is determined.
      await expectAsync(document.body).toBeAccessible({
        rules: {
          region: {
            enabled: false,
          },
        },
      });
    });

    it('should be accessible when using a full page non-blocking element', async () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isFullPage = false;
      fixture.componentInstance.isWaiting = true;
      fixture.componentInstance.isNonBlocking = true;
      fixture.detectChanges();

      await expectAsync(document.body).toBeAccessible({
        rules: {
          region: {
            enabled: false,
          },
        },
      });
    });
  });
});
