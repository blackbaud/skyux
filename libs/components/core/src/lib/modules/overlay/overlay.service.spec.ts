import { NgZone } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  inject,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';

import { take } from 'rxjs/operators';

import { OverlayFixtureContext } from './fixtures/overlay-context.fixture';
import { OverlayEntryFixtureComponent } from './fixtures/overlay-entry.component.fixture';
import { OverlayFixtureComponent } from './fixtures/overlay.component.fixture';
import { OverlayFixturesModule } from './fixtures/overlay.fixtures.module';
import { SkyOverlayAdapterService } from './overlay-adapter.service';
import { SkyOverlayConfig } from './overlay-config';
import { SkyOverlayInstance } from './overlay-instance';
import { SkyOverlayService } from './overlay.service';

describe('Overlay service', () => {
  let service: SkyOverlayService;
  let fixture: ComponentFixture<OverlayFixtureComponent>;

  function getAllOverlays(): NodeListOf<Element> {
    return document.querySelectorAll('.sky-overlay');
  }

  function createOverlay(config?: SkyOverlayConfig): SkyOverlayInstance {
    const instance = service.create(config);
    fixture.detectChanges();
    tick();

    return instance;
  }

  function destroyOverlay(instance: SkyOverlayInstance): void {
    service.close(instance);
    fixture.detectChanges();
    tick();
  }

  function verifyOverlayCount(num: number): void {
    expect(getAllOverlays().length).toEqual(num);
  }

  function getStyleElement(): HTMLStyleElement {
    return document
      .getElementsByTagName('head')[0]
      .querySelector(
        '[data-test-selector="sky-overlay-restrict-scroll-styles"]',
      ) as HTMLStyleElement;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayFixturesModule],
    });

    fixture = TestBed.createComponent(OverlayFixtureComponent);
  });

  beforeEach(inject([SkyOverlayService], (_service: SkyOverlayService) => {
    service = _service;
  }));

  afterEach(fakeAsync(() => {
    service.closeAll();

    fixture.detectChanges();
    tick();

    verifyOverlayCount(0);

    fixture.destroy();
  }));

  it('should create an overlay', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    createOverlay();

    verifyOverlayCount(1);
  }));

  it('should optionally prevent body scroll', fakeAsync(
    inject([SkyOverlayAdapterService], (adapter: SkyOverlayAdapterService) => {
      fixture.detectChanges();
      tick();

      const adapterSpy = spyOn(adapter, 'restrictBodyScroll').and.callThrough();
      const instance = createOverlay();

      let styleElement = getStyleElement();

      expect(adapterSpy).not.toHaveBeenCalled();
      expect(styleElement).toBeNull();

      verifyOverlayCount(1);

      destroyOverlay(instance);
      adapterSpy.calls.reset();

      createOverlay({
        enableScroll: false,
      });

      styleElement = getStyleElement();

      expect(adapterSpy).toHaveBeenCalled();
      expect(styleElement.textContent).toContain('body { overflow: hidden }');
      verifyOverlayCount(1);
    }),
  ));

  it('should optionally allow closing overlay when clicking outside', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const instance = createOverlay();

    SkyAppTestUtility.fireDomEvent(getAllOverlays().item(0), 'click');
    fixture.detectChanges();
    tick();

    // The overlay should still exist.
    verifyOverlayCount(1);

    destroyOverlay(instance);

    createOverlay({
      enableClose: true,
    });

    SkyAppTestUtility.fireDomEvent(getAllOverlays().item(0), 'click');
    fixture.detectChanges();
    tick();

    // The overlay should now be gone.
    verifyOverlayCount(0);
  }));

  it('should not close overlay if overlay content is clicked', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    createOverlay({
      enableClose: true,
    });

    SkyAppTestUtility.fireDomEvent(
      document.querySelector('.sky-overlay-content') as Element,
      'click',
    );
    fixture.detectChanges();
    tick();

    verifyOverlayCount(1);
  }));

  it('should prevent body scroll after another overlay is closed', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const instance1 = createOverlay({
      enableScroll: false,
    });

    const instance2 = createOverlay({
      enableScroll: false,
    });

    // Overflow should be applied to the body.
    expect(getStyleElement()).toBeTruthy();
    verifyOverlayCount(2);

    destroyOverlay(instance1);

    // The body should still have overflow applied.
    expect(getStyleElement()).toBeTruthy();
    verifyOverlayCount(1);

    destroyOverlay(instance2);

    // Now that all overlays are closed, the body should not have any overflow.
    expect(getStyleElement()).toBeNull();
    verifyOverlayCount(0);
  }));

  it('should optionally show a backdrop', fakeAsync(() => {
    const instance = createOverlay();

    let backdropElement = document.querySelector('.sky-overlay-backdrop');

    expect(backdropElement).toBeNull();

    destroyOverlay(instance);

    createOverlay({
      showBackdrop: true,
    });

    backdropElement = document.querySelector('.sky-overlay-backdrop');

    expect(backdropElement).not.toBeNull();
  }));

  it('should close all on navigation change', fakeAsync(
    inject([NgZone, Router], (ngZone: NgZone, router: Router) => {
      createOverlay();
      createOverlay();
      createOverlay();

      verifyOverlayCount(3);

      // Run navigation through NgZone to avoid warnings in the console.
      ngZone.run(() => {
        void router.navigate(['/']);
        fixture.detectChanges();
        tick();
        verifyOverlayCount(0);
      });
    }),
  ));

  it('should optionally remain open on navigation change', fakeAsync(
    inject([NgZone, Router], (ngZone: NgZone, router: Router) => {
      createOverlay({
        closeOnNavigation: false,
      });

      verifyOverlayCount(1);

      ngZone.run(() => {
        void router.navigate(['/']);
        fixture.detectChanges();
        tick();

        verifyOverlayCount(1);
      });
    }),
  ));

  it('should optionally allow pointer events to pass through the overlay', fakeAsync(() => {
    let instance = createOverlay({
      enablePointerEvents: false, // default
    });

    expect(getAllOverlays().item(0)).not.toHaveCssClass(
      'enable-pointer-events-pass-through',
    );
    destroyOverlay(instance);

    instance = createOverlay({
      enablePointerEvents: true,
    });

    expect(getAllOverlays().item(0)).toHaveCssClass(
      'enable-pointer-events-pass-through',
    );
  }));

  it('should optionally hide elements outside the overlay from screen readers', fakeAsync(() => {
    const siblingEl = document.createElement('div');
    document.body.appendChild(siblingEl);

    // This element should remain hidden to screen readers after the overlay is displayed.
    const siblingAriaHiddenEl = document.createElement('div');
    siblingAriaHiddenEl.ariaHidden = 'true';
    document.body.appendChild(siblingAriaHiddenEl);

    expect(siblingEl.ariaHidden).toBeNull();
    expect(siblingAriaHiddenEl.ariaHidden).toBe('true');

    fixture.detectChanges();
    tick();

    const instance = createOverlay({
      hideOthersFromScreenReaders: true,
    });

    verifyOverlayCount(1);

    expect(siblingEl.ariaHidden).toBe('true');
    expect(siblingAriaHiddenEl.ariaHidden).toBe('true');

    destroyOverlay(instance);

    expect(siblingEl.ariaHidden).toBeNull();
    expect(siblingAriaHiddenEl.ariaHidden).toBe('true');

    document.body.removeChild(siblingEl);
    document.body.removeChild(siblingAriaHiddenEl);
  }));

  it('should attach a component', async () => {
    const overlay = service.create();

    overlay.attachComponent(OverlayEntryFixtureComponent);

    fixture.detectChanges();

    await fixture.whenStable();

    expect(getAllOverlays().item(0).textContent).toContain(
      'Overlay content ID: none',
    );
  });

  it('should attach a component with providers', async () => {
    const overlay = service.create();

    overlay.attachComponent(OverlayEntryFixtureComponent, [
      {
        provide: OverlayFixtureContext,
        useValue: new OverlayFixtureContext('1'),
      },
    ]);

    fixture.detectChanges();

    await fixture.whenStable();

    expect(getAllOverlays().item(0).textContent).toContain(
      'Overlay content ID: 1',
    );
  });

  it('should attach a template', async () => {
    const overlay = service.create();

    overlay.attachTemplate(fixture.componentInstance.myTemplate, {
      $implicit: {
        id: 5,
      },
    });

    fixture.detectChanges();

    await fixture.whenStable();

    expect(getAllOverlays().item(0).textContent).toContain(
      'Templated content ID: 5',
    );
  });

  it('should be accessible', async () => {
    const overlay = service.create();

    fixture.detectChanges();

    await fixture.whenStable();

    await expectAsync(getAllOverlays().item(0)).toBeAccessible();
    service.close(overlay);

    fixture.detectChanges();

    // Create overlay with all options turned on.
    service.create({
      closeOnNavigation: false,
      enableClose: true,
      enableScroll: false,
      showBackdrop: true,
    });

    fixture.detectChanges();

    await fixture.whenStable();

    await expectAsync(getAllOverlays().item(0)).toBeAccessible();
  });

  it('should emit when overlay is closed by the service', fakeAsync(() => {
    const instance = createOverlay();

    let closedCalled = false;

    instance.closed.pipe(take(1)).subscribe(() => {
      closedCalled = true;
    });

    service.close(instance);

    expect(closedCalled).toEqual(true);
  }));

  it('should emit when a user clicks outside of the overlay content', fakeAsync(() => {
    const instance = createOverlay();

    let backdropClickCalled = false;
    instance.backdropClick.pipe(take(1)).subscribe(() => {
      backdropClickCalled = true;
    });

    SkyAppTestUtility.fireDomEvent(document.body, 'click');
    fixture.detectChanges();
    tick();

    expect(backdropClickCalled).toEqual(true);
    backdropClickCalled = false;

    // Clicking the overlay content should not trigger the event.
    SkyAppTestUtility.fireDomEvent(
      getAllOverlays().item(0).querySelector('.sky-overlay-content') as Element,
      'click',
    );

    fixture.detectChanges();
    tick();

    expect(backdropClickCalled).toEqual(false);
  }));

  it('should increment z-index for each overlay', fakeAsync(() => {
    createOverlay();
    createOverlay();
    const overlays = getAllOverlays();
    const zIndex1 = getComputedStyle(overlays.item(0)).zIndex;
    const zIndex2 = getComputedStyle(overlays.item(1)).zIndex;
    expect(zIndex2 > zIndex1).toEqual(true);
  }));

  it('should add additional classes from the configuration', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    createOverlay({
      wrapperClass: 'added-class',
    });

    expect(
      Array.from(getAllOverlays()).shift()?.classList.contains('added-class'),
    ).toBeTrue();
  }));

  it('should add an ID to the overlay wrapper element', () => {
    service.create();

    fixture.detectChanges();

    const el = document.querySelector('sky-overlay');

    expect(el?.id).toBeTruthy();
  });

  it('should set the clip-path property on the overlay wrapper element', async () => {
    const instance = service.create();
    instance.componentRef.instance.updateClipPath(
      'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    );
    fixture.detectChanges();
    await fixture.whenStable();

    const el = document.querySelector('sky-overlay > div.sky-overlay');

    expect(el).toBeTruthy();
    expect((el as HTMLElement).style.clipPath).toBeTruthy();
  });
});
