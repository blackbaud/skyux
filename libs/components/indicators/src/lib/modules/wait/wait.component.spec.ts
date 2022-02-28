import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';

import { SkyWaitFixturesModule } from './fixtures/wait-fixtures.module';
import { SkyWaitTestComponent } from './fixtures/wait.component.fixture';
import { SkyWaitAdapterService } from './wait-adapter.service';
import { SkyWaitComponent } from './wait.component';

describe('Wait component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyWaitFixturesModule],
    });
  });

  it('should show the wait element when isWaiting is set to true', async(() => {
    const fixture = TestBed.createComponent(SkyWaitComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement;
    expect(el.querySelector('.sky-wait')).toBeNull();

    fixture.componentInstance.isWaiting = true;
    fixture.detectChanges();
    expect(el.querySelector('.sky-wait')).not.toBeNull();
    fixture.whenStable().then(async () => {
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  }));

  it('should set relative position on the wait component parent element', () => {
    const fixture = TestBed.createComponent(SkyWaitTestComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement;
    fixture.componentInstance.isWaiting = true;
    fixture.detectChanges();
    expect(el.querySelector('.sky-wait-test-component').style.position).toBe(
      'relative'
    );
    expect(el.querySelector('.sky-wait-mask-loading-blocking')).not.toBeNull();

    fixture.componentInstance.isWaiting = false;
    fixture.detectChanges();
    expect(el.querySelector('.sky-wait-test-component').style.position).toBe(
      ''
    );
  });

  it('should set the appropriate class when wait component fullPage is set to true', () => {
    const fixture = TestBed.createComponent(SkyWaitTestComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement;
    fixture.componentInstance.isFullPage = true;
    fixture.componentInstance.isWaiting = true;
    fixture.detectChanges();
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
    fixture.detectChanges();

    const el = fixture.nativeElement;
    fixture.componentInstance.isNonBlocking = true;
    fixture.componentInstance.isWaiting = true;
    fixture.detectChanges();
    expect(
      el.querySelector('.sky-wait-mask-loading-non-blocking')
    ).not.toBeNull();

    fixture.componentInstance.isNonBlocking = true;
    fixture.detectChanges();
    expect(el.querySelector('.sky-wait-mask-loading-blocking')).toBeNull();
  });

  it('should prevent tab navigation and focus when fullPage is true', fakeAsync(() => {
    const fixture = TestBed.createComponent(SkyWaitTestComponent);
    fixture.detectChanges();

    fixture.componentInstance.isNonBlocking = false;
    fixture.componentInstance.isFullPage = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    fixture.componentInstance.isWaiting = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const bodyFocusSpy = spyOn(document.body, 'focus').and.callThrough();

    SkyAppTestUtility.fireDomEvent(document.body, 'keydown', {
      keyboardEventInit: {
        key: 'tab',
      },
    });

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(document.activeElement).toBe(document.body);
    expect(bodyFocusSpy).toHaveBeenCalledTimes(1);

    const anchor2: any = document.body.querySelector('#anchor-2');
    fixture.componentInstance.secondWaitIsWaiting = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(anchor2, 'focusin', {
      customEventInit: {
        relatedTarget: document.body,
      },
    });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(document.activeElement).toBe(document.body);
  }));

  it(`should allow tab navigation and focus after a fullPage wait is removed when another non-blocking wait still exists and both waits were added at the same time`, fakeAsync(() => {
    // NOTE: This test was added due to a race condition with two quickly added waits on load
    const fixture = TestBed.createComponent(SkyWaitTestComponent);
    fixture.detectChanges();

    fixture.componentInstance.startBlockingWait();
    fixture.componentInstance.startNonBlockingWait();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const bodyFocusSpy = spyOn(document.body, 'focus').and.callThrough();

    SkyAppTestUtility.fireDomEvent(document.body, 'keydown', {
      keyboardEventInit: {
        key: 'tab',
      },
    });

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(bodyFocusSpy).toHaveBeenCalledTimes(1);

    const anchor2: any = document.body.querySelector('#anchor-2');

    SkyAppTestUtility.fireDomEvent(anchor2, 'focusin', {
      customEventInit: {
        relatedTarget: document.body,
      },
    });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(document.activeElement).toBe(document.body);

    fixture.componentInstance.endBlockingWait();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(document.body, 'keydown', {
      keyboardEventInit: {
        key: 'tab',
      },
    });

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(bodyFocusSpy).toHaveBeenCalledTimes(1);

    SkyAppTestUtility.fireDomEvent(anchor2, 'focusin', {
      customEventInit: {
        relatedTarget: document.body,
      },
    });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(document.activeElement).toBe(document.body);

    // Clean up the existing wait so that there are not test side effects for other tests.
    fixture.componentInstance.endNonBlockingWait();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }));

  it('should propagate tab navigation forward and backward avoiding waited element', fakeAsync(() => {
    const fixture = TestBed.createComponent(SkyWaitTestComponent);
    fixture.detectChanges();

    fixture.componentInstance.isNonBlocking = false;
    fixture.componentInstance.isFullPage = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    fixture.componentInstance.isWaiting = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const waitButton = document.body.querySelector('#inside-button');
    const anchor0: any = document.body.querySelector('#anchor-0');
    const anchor1: any = document.body.querySelector('#anchor-1');
    const anchor2: any = document.body.querySelector('#anchor-2');

    anchor1.focus();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(waitButton, 'focusin', {
      customEventInit: {
        relatedTarget: anchor1,
      },
    });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(document.activeElement).toBe(anchor2);

    anchor2.focus();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(waitButton, 'focusin', {
      customEventInit: {
        relatedTarget: anchor2,
      },
    });

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(document.activeElement).toBe(anchor1);

    // Wrapping navigation
    fixture.componentInstance.showAnchor0 = true;
    fixture.componentInstance.showAnchor2 = false;
    anchor1.focus();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(waitButton, 'focusin', {
      customEventInit: {
        relatedTarget: anchor1,
      },
    });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(document.activeElement).toBe(anchor0);

    // Invisible elements
    // test display:none
    fixture.componentInstance.showAnchor0 = true;
    fixture.componentInstance.showAnchor2 = true;
    fixture.componentInstance.anchor2Display = 'none';

    anchor1.focus();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(waitButton, 'focusin', {
      customEventInit: {
        relatedTarget: anchor1,
      },
    });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(document.activeElement).toBe(anchor0);

    // test display:none
    fixture.componentInstance.showAnchor0 = true;
    fixture.componentInstance.showAnchor2 = true;
    fixture.componentInstance.anchor2Display = '';
    fixture.componentInstance.anchor2Visibility = 'hidden';
    anchor1.focus();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(waitButton, 'focusin', {
      customEventInit: {
        relatedTarget: anchor1,
      },
    });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(document.activeElement).toBe(anchor0);

    fixture.componentInstance.showAnchor0 = true;
    fixture.componentInstance.showAnchor2 = true;
    fixture.componentInstance.anchor0Visibility = 'hidden';
    fixture.componentInstance.anchor2Display = 'none';
    anchor1.focus();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(waitButton, 'focusin', {
      customEventInit: {
        relatedTarget: anchor1,
      },
    });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(document.activeElement).toBe(anchor1);

    fixture.componentInstance.showAnchor0 = false;
    fixture.componentInstance.showAnchor2 = false;
    anchor1.focus();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(waitButton, 'focusin', {
      customEventInit: {
        relatedTarget: anchor1,
      },
    });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(document.activeElement).toBe(anchor1);

    fixture.componentInstance.isWaiting = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    anchor1.focus();
    SkyAppTestUtility.fireDomEvent(waitButton, 'focusin', {
      customEventInit: {
        relatedTarget: anchor1,
      },
    });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(document.activeElement).toBe(anchor1);
  }));

  it('should ignore other blocking wait when propagating tab navigation', fakeAsync(() => {
    const fixture = TestBed.createComponent(SkyWaitTestComponent);
    fixture.detectChanges();

    fixture.componentInstance.isNonBlocking = false;
    fixture.componentInstance.isFullPage = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    fixture.componentInstance.isWaiting = true;
    fixture.componentInstance.secondWaitIsWaiting = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const waitButton = document.body.querySelector('#inside-button');
    const anchor0: any = document.body.querySelector('#anchor-0');
    const anchor1: any = document.body.querySelector('#anchor-1');
    anchor1.focus();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(waitButton, 'focusin', {
      customEventInit: {
        relatedTarget: anchor1,
      },
    });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(document.activeElement).toBe(anchor0);
  }));

  it('should set aria-busy on document body when fullPage is true', async(() => {
    const fixture = TestBed.createComponent(SkyWaitTestComponent);
    fixture.detectChanges();

    fixture.componentInstance.isFullPage = true;
    fixture.detectChanges();
    fixture.componentInstance.isWaiting = true;
    fixture.detectChanges();
    expect(document.body.getAttribute('aria-busy')).toBe('true');

    fixture.whenStable().then(async () => {
      await expectAsync(fixture.nativeElement).toBeAccessible();
      fixture.componentInstance.isWaiting = false;
      fixture.detectChanges();
      expect(document.body.getAttribute('aria-busy')).toBeNull();
    });
  }));

  it('should set aria-busy on containing div when fullPage is set to false', () => {
    const fixture = TestBed.createComponent(SkyWaitTestComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement;
    fixture.componentInstance.isWaiting = true;
    fixture.detectChanges();
    expect(
      el.querySelector('.sky-wait-test-component').getAttribute('aria-busy')
    ).toBe('true');

    fixture.componentInstance.isWaiting = false;
    fixture.detectChanges();
    expect(
      el.querySelector('.sky-wait-test-component').getAttribute('aria-busy')
    ).toBeNull();
  });

  it('should set isPageWaitActive when fullPage is true', fakeAsync(() => {
    const fixture = TestBed.createComponent(SkyWaitTestComponent);

    fixture.componentInstance.isNonBlocking = false;
    fixture.componentInstance.isFullPage = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    fixture.componentInstance.isWaiting = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect((SkyWaitAdapterService as any).isPageWaitActive).toBeTruthy();

    fixture.componentInstance.isWaiting = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect((SkyWaitAdapterService as any).isPageWaitActive).toBeFalsy();
  }));

  function getAriaLabel(): string {
    return document.body
      .querySelector('.sky-wait-mask')
      .getAttribute('aria-label');
  }

  it('should use inputted aria-label', async(() => {
    const fixture = TestBed.createComponent(SkyWaitTestComponent);

    fixture.componentInstance.ariaLabel = 'test label';
    fixture.componentInstance.isNonBlocking = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      fixture.componentInstance.isWaiting = true;
      fixture.detectChanges();

      const ariaLabel = getAriaLabel();
      expect(ariaLabel).toBe('test label');
    });
  }));

  it('should set aria-label on document body when fullPage is true and is blocking', async(() => {
    const fixture = TestBed.createComponent(SkyWaitTestComponent);
    fixture.componentInstance.isFullPage = true;
    fixture.componentInstance.isWaiting = true;
    fixture.componentInstance.isNonBlocking = false;
    fixture.detectChanges();

    const ariaLabel = getAriaLabel();
    expect(ariaLabel).toBe('Page loading. Please wait.');
  }));

  it('should set aria-label on document body when fullPage is true and is not blocking', async(() => {
    const fixture = TestBed.createComponent(SkyWaitTestComponent);
    fixture.componentInstance.isFullPage = true;
    fixture.componentInstance.isWaiting = true;
    fixture.componentInstance.isNonBlocking = true;
    fixture.detectChanges();

    const ariaLabel = getAriaLabel();
    expect(ariaLabel).toBe('Page loading.');
  }));

  it('should set aria-label on containing div when fullPage is set to false and is blocking', async(() => {
    const fixture = TestBed.createComponent(SkyWaitTestComponent);
    fixture.componentInstance.isFullPage = false;
    fixture.componentInstance.isWaiting = true;
    fixture.componentInstance.isNonBlocking = false;
    fixture.detectChanges();

    const ariaLabel = getAriaLabel();
    expect(ariaLabel).toBe('Loading. Please wait.');
  }));

  it('should set aria-label on containing div when fullPage is set to false and is not blocking', async(() => {
    const fixture = TestBed.createComponent(SkyWaitTestComponent);
    fixture.componentInstance.isFullPage = false;
    fixture.componentInstance.isWaiting = true;
    fixture.componentInstance.isNonBlocking = true;
    fixture.detectChanges();

    const ariaLabel = getAriaLabel();
    expect(ariaLabel).toBe('Loading.');
  }));

  it('should not use default aria-label when one is provided', async(() => {
    const fixture = TestBed.createComponent(SkyWaitTestComponent);
    fixture.componentInstance.isFullPage = false;
    fixture.componentInstance.isWaiting = true;
    fixture.componentInstance.isNonBlocking = false;
    fixture.componentInstance.ariaLabel = 'Waiting on the page to load.';
    fixture.detectChanges();

    const ariaLabel = getAriaLabel();
    expect(ariaLabel).toBe('Waiting on the page to load.');
  }));
});
