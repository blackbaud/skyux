import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  SkyAppTestUtility,
  SkyAppTestUtilityDomEventOptions,
  expect,
  expectAsync,
} from '@skyux-sdk/testing';

import { SkyWaitFixturesModule } from './fixtures/wait-fixtures.module';
import { SkyWaitTestComponent } from './fixtures/wait.component.fixture';
import { SkyWaitAdapterService } from './wait-adapter.service';
import { SkyWaitComponent } from './wait.component';

describe('Wait component', () => {
  function fireDomEvent(
    element: Element | null,
    eventName: string,
    options?: SkyAppTestUtilityDomEventOptions
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyWaitFixturesModule],
    });
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

      expect(el.querySelector('.sky-wait-test-component').style.position).toBe(
        'relative'
      );
      expect(
        el.querySelector('.sky-wait-mask-loading-blocking')
      ).not.toBeNull();

      fixture.componentInstance.isWaiting = false;
      fixture.detectChanges();

      expect(el.querySelector('.sky-wait-test-component').style.position).toBe(
        ''
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
        ''
      );

      fixture.componentInstance.isWaiting = false;
      fixture.detectChanges();

      expect(el.querySelector('.sky-wait-test-component').style.position).toBe(
        ''
      );
      expect(el.querySelector('.sky-wait')).toBeNull();

      fixture.componentInstance.isWaiting = true;
      fixture.componentInstance.isFullPage = false;
      fixture.detectChanges();

      expect(el.querySelector('.sky-wait-mask-loading-fixed')).toBeNull();
      expect(el.querySelector('.sky-wait-test-component').style.position).toBe(
        'relative'
      );
    });

    it('should set the appropriate class when nonBlocking is set to true', () => {
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.componentInstance.isNonBlocking = true;
      fixture.componentInstance.isWaiting = true;
      fixture.detectChanges();

      const el = fixture.nativeElement;

      expect(
        el.querySelector('.sky-wait-mask-loading-non-blocking')
      ).not.toBeNull();

      fixture.componentInstance.isNonBlocking = true;
      fixture.detectChanges();

      expect(el.querySelector('.sky-wait-mask-loading-blocking')).toBeNull();
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

    fit(`should allow tab navigation and focus after a fullPage wait is removed when another non-blocking wait still exists and both waits were added at the same time`, fakeAsync(() => {
      // NOTE: This test was added due to a race condition with two quickly added waits on load
      const fixture = TestBed.createComponent(SkyWaitTestComponent);
      fixture.detectChanges();

      fixture.componentInstance.startBlockingWait();
      fixture.componentInstance.startNonBlockingWait();
      fixture.detectChanges();
      tick();

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
        el.querySelector('.sky-wait-test-component').getAttribute('aria-busy')
      ).toBe('true');

      fixture.componentInstance.isWaiting = false;
      fixture.detectChanges();

      expect(
        el.querySelector('.sky-wait-test-component').getAttribute('aria-busy')
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
      const liveAnnouncer = TestBed.inject(LiveAnnouncer);
      const liveAnnouncerSpy = spyOn(liveAnnouncer, 'announce').and.stub();
      fixture.componentInstance.ariaLabel = 'test label';
      fixture.componentInstance.screenReaderCompletedText =
        'test completed text';
      fixture.componentInstance.isNonBlocking = false;
      fixture.componentInstance.isWaiting = true;
      expect(liveAnnouncerSpy).not.toHaveBeenCalled();
      fixture.detectChanges();

      expect(liveAnnouncerSpy).toHaveBeenCalledOnceWith('test label');
      liveAnnouncerSpy.calls.reset();

      fixture.componentInstance.isWaiting = false;
      fixture.detectChanges();

      expect(liveAnnouncerSpy).toHaveBeenCalledOnceWith('test completed text');
    });

    // it('should respect changes to aria-label after the component is rendered', () => {
    //   const fixture = TestBed.createComponent(SkyWaitTestComponent);
    //   fixture.componentInstance.ariaLabel = 'test label';
    //   fixture.componentInstance.isNonBlocking = false;
    //   fixture.componentInstance.isWaiting = true;
    //   fixture.detectChanges();

    //   expect(getAriaLabel()).toBe('test label');

    //   fixture.componentInstance.ariaLabel = 'another test label';
    //   fixture.detectChanges();

    //   expect(getAriaLabel()).toBe('another test label');
    // });

    // it('should set aria-label on document body when fullPage is true and is blocking', () => {
    //   const fixture = TestBed.createComponent(SkyWaitTestComponent);
    //   fixture.componentInstance.isFullPage = true;
    //   fixture.componentInstance.isWaiting = true;
    //   fixture.componentInstance.isNonBlocking = false;
    //   fixture.detectChanges();

    //   expect(getAriaLabel()).toBe('Page loading. Please wait.');
    // });

    // it('should set aria-label on document body when fullPage is true and is not blocking', () => {
    //   const fixture = TestBed.createComponent(SkyWaitTestComponent);
    //   fixture.componentInstance.isFullPage = true;
    //   fixture.componentInstance.isWaiting = true;
    //   fixture.componentInstance.isNonBlocking = true;
    //   fixture.detectChanges();

    //   expect(getAriaLabel()).toBe('Page loading.');
    // });

    // it('should set aria-label on containing div when fullPage is set to false and is blocking', () => {
    //   const fixture = TestBed.createComponent(SkyWaitTestComponent);
    //   fixture.componentInstance.isFullPage = false;
    //   fixture.componentInstance.isWaiting = true;
    //   fixture.componentInstance.isNonBlocking = false;
    //   fixture.detectChanges();

    //   expect(getAriaLabel()).toBe('Loading. Please wait.');
    // });

    // it('should set aria-label on containing div when fullPage is set to false and is not blocking', () => {
    //   const fixture = TestBed.createComponent(SkyWaitTestComponent);
    //   fixture.componentInstance.isFullPage = false;
    //   fixture.componentInstance.isWaiting = true;
    //   fixture.componentInstance.isNonBlocking = true;
    //   fixture.detectChanges();

    //   expect(getAriaLabel()).toBe('Loading.');
    // });

    // it('should not use default aria-label when one is provided', () => {
    //   const fixture = TestBed.createComponent(SkyWaitTestComponent);
    //   fixture.componentInstance.isFullPage = false;
    //   fixture.componentInstance.isWaiting = true;
    //   fixture.componentInstance.isNonBlocking = false;
    //   fixture.componentInstance.ariaLabel = 'Waiting for the page to load.';
    //   fixture.detectChanges();

    //   expect(getAriaLabel()).toBe('Waiting for the page to load.');
    // });

    // it('should update aria-label with default when fullPage or isNonBlocking is updated', () => {
    //   const fixture = TestBed.createComponent(SkyWaitTestComponent);
    //   fixture.componentInstance.isWaiting = true;
    //   fixture.detectChanges();

    //   expect(getAriaLabel()).toBe('Loading. Please wait.');

    //   fixture.componentInstance.isFullPage = true;
    //   fixture.detectChanges();

    //   expect(getAriaLabel()).toBe('Page loading. Please wait.');

    //   fixture.componentInstance.isNonBlocking = true;
    //   fixture.detectChanges();

    //   expect(getAriaLabel()).toBe('Page loading.');
    // });

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
