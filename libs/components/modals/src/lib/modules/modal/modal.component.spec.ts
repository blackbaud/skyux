import { ApplicationRef } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';
import {
  MutationObserverService,
  SkyCoreAdapterService,
  SkyDockLocation,
  SkyDockService,
} from '@skyux/core';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

import { ModalMockMutationObserverService } from './fixtures/mock-modal-mutation-observer';
import { ModalMockThemeService } from './fixtures/mock-theme.service';
import { ModalAutofocusTestComponent } from './fixtures/modal-autofocus.component.fixture';
import { SkyModalFixturesModule } from './fixtures/modal-fixtures.module';
import { ModalFooterTestComponent } from './fixtures/modal-footer.component.fixture';
import { ModalNoHeaderTestComponent } from './fixtures/modal-no-header.component.fixture';
import { ModalTiledBodyTestComponent } from './fixtures/modal-tiled-body.component.fixture';
import { ModalWithCloseConfirmTestComponent } from './fixtures/modal-with-close-confirm.component.fixture';
import { ModalWithFocusContentTestComponent } from './fixtures/modal-with-focus-content.fixture';
import { ModalWithFocusContext } from './fixtures/modal-with-focus-context.fixture';
import { ModalTestComponent } from './fixtures/modal.component.fixture';
import { SkyModalBeforeCloseHandler } from './modal-before-close-handler';
import { SkyModalComponentAdapterService } from './modal-component-adapter.service';
import { SkyModalInstance } from './modal-instance';
import { SkyModalService } from './modal.service';

describe('Modal component', () => {
  let testModals: SkyModalInstance[];

  function getApplicationRef(): ApplicationRef {
    return TestBed.inject(ApplicationRef);
  }

  function getModalService(): SkyModalService {
    return TestBed.inject(SkyModalService);
  }

  function getRouter(): Router {
    return TestBed.inject(Router);
  }

  function getMockMutationObserverService(): ModalMockMutationObserverService {
    return TestBed.inject<any>(MutationObserverService);
  }

  function openModal<T>(modalType: T, config?: Record<string, any>) {
    const modalInstance = getModalService().open(modalType, config);

    modalInstance.closed.subscribe(() => {
      const modalIndex = testModals.indexOf(modalInstance);

      if (modalIndex >= 0) {
        testModals.splice(modalIndex, 1);
      }
    });

    getApplicationRef().tick();
    tick();

    testModals.push(modalInstance);

    return modalInstance;
  }

  function closeModal(modalInstance: SkyModalInstance) {
    modalInstance.close();
    tick();
    getApplicationRef().tick();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyModalFixturesModule],
    });

    testModals = [];
  });

  afterEach(fakeAsync(() => {
    // NOTE: This is important as it ensures that the modal host component is fully disposed of
    // between tests. This is important as the modal host might need a different set of component
    // injectors than the previous test.
    getModalService().dispose();

    // Clean up any modals that did not close due to a test failure so subsequent tests
    // do not fail.
    const testModalsToClose = testModals.slice();

    for (let i = testModalsToClose.length - 1; i >= 0; i--) {
      closeModal(testModalsToClose[i]);
    }
  }));

  it('should render on top of previously-opened modals', fakeAsync(() => {
    const modalInstance1 = openModal(ModalTestComponent);
    const modalInstance2 = openModal(ModalTestComponent);

    const modalEls = document.querySelectorAll('.sky-modal');

    const zIndex1 = parseInt(getComputedStyle(modalEls[0]).zIndex, 10);
    const zIndex2 = parseInt(getComputedStyle(modalEls[1]).zIndex, 10);

    expect(zIndex2).toBeGreaterThan(zIndex1);

    closeModal(modalInstance2);
    closeModal(modalInstance1);
  }));

  it('should focus the first focusable element when no autofocus is inside of content', fakeAsync(() => {
    const modalInstance1 = openModal(ModalWithFocusContentTestComponent);
    expect(document.activeElement).toEqual(
      document.querySelector('#visible-btn')
    );
    closeModal(modalInstance1);
  }));

  it('should focus the first non-disabled element if the first element is disabled', fakeAsync(() => {
    const modalInstance1 = openModal(ModalWithFocusContentTestComponent, {
      providers: [
        {
          provide: ModalWithFocusContext,
          useValue: {
            disableFirstContent: true,
          },
        },
      ],
    });
    expect(document.activeElement).toEqual(
      document.querySelector('#visible-btn-2')
    );
    closeModal(modalInstance1);
  }));

  it('should focus the dialog when no autofocus or focus element is inside of content', fakeAsync(() => {
    const modalInstance1 = openModal(ModalTestComponent);
    expect(document.activeElement).toEqual(
      document.querySelector('.sky-modal-content')
    );
    closeModal(modalInstance1);
  }));

  it('should focus the dialog when all focuable elements are disabled', fakeAsync(() => {
    const modalInstance1 = openModal(ModalWithFocusContentTestComponent, {
      providers: [
        {
          provide: ModalWithFocusContext,
          useValue: {
            disableFirstContent: true,
            disableSecondContent: true,
          },
        },
      ],
    });
    expect(document.activeElement).toEqual(
      document.querySelector('.sky-modal-content')
    );
    closeModal(modalInstance1);
  }));

  it('should focus the autofocus element when autofocus is inside of content', fakeAsync(() => {
    const modalInstance1 = openModal(ModalAutofocusTestComponent);
    expect(document.activeElement).toEqual(
      document.querySelector('#autofocus-el')
    );
    closeModal(modalInstance1);
  }));

  it('should handle escape key press when modal is the top modal', fakeAsync(() => {
    openModal(ModalFooterTestComponent);
    const escapeEvent: any = document.createEvent('CustomEvent');
    escapeEvent.which = 27;
    escapeEvent.keyCode = 27;
    escapeEvent.initEvent('keyup', true, true);

    document.dispatchEvent(escapeEvent);

    tick();
    getApplicationRef().tick();

    expect(document.querySelector('.sky-modal')).not.toExist();
  }));

  it('should handle escape when modals are stacked', fakeAsync(() => {
    const modalInstance2 = openModal(ModalAutofocusTestComponent);
    const modalInstance1 = openModal(ModalFooterTestComponent);

    const escapeEvent: any = document.createEvent('CustomEvent');
    escapeEvent.which = 27;
    escapeEvent.keyCode = 27;
    escapeEvent.shiftKey = false;
    escapeEvent.initEvent('keyup', true, true);

    document.querySelector('.sky-modal').dispatchEvent(escapeEvent);
    document.querySelector('.sky-modal').dispatchEvent(escapeEvent);

    tick();
    getApplicationRef().tick();

    expect(document.querySelector('.sky-modal')).not.toExist();

    closeModal(modalInstance1);
    closeModal(modalInstance2);
  }));

  it('should handle a different key code with keyup event', fakeAsync(() => {
    const modalInstance1 = openModal(ModalFooterTestComponent);

    const unknownEvent: any = document.createEvent('CustomEvent');
    unknownEvent.which = 3;
    unknownEvent.keyCode = 3;
    unknownEvent.shiftKey = false;
    unknownEvent.initEvent('keyup', true, true);

    document.querySelector('.sky-btn-primary').dispatchEvent(unknownEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).not.toEqual(
      document.querySelector('.sky-modal-btn-close')
    );
    expect(document.querySelector('.sky-modal')).toExist();

    closeModal(modalInstance1);
  }));

  it('should handle tab with shift when focus is on modal and in top modal', fakeAsync(() => {
    const modalInstance1 = openModal(ModalFooterTestComponent);
    const tabEvent: any = document.createEvent('CustomEvent');
    tabEvent.which = 9;
    tabEvent.keyCode = 9;
    tabEvent.shiftKey = true;
    tabEvent.initEvent('keydown', true, true);

    document.querySelector('.sky-modal-dialog').dispatchEvent(tabEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).toEqual(
      document.querySelector('.sky-btn-primary')
    );

    closeModal(modalInstance1);
  }));

  it('should handle tab with shift when focus is in first item and in top modal', fakeAsync(() => {
    const modalInstance1 = openModal(ModalFooterTestComponent);

    const tabEvent: any = document.createEvent('CustomEvent');
    tabEvent.which = 9;
    tabEvent.keyCode = 9;
    tabEvent.shiftKey = true;
    tabEvent.initEvent('keydown', true, true);

    document.querySelector('.sky-modal-btn-close').dispatchEvent(tabEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).toEqual(
      document.querySelector('.sky-btn-primary')
    );

    closeModal(modalInstance1);
  }));

  it('should handle tab with shift when focus is in last item and in top modal', fakeAsync(() => {
    const modalInstance1 = openModal(ModalFooterTestComponent);

    const tabEvent: any = document.createEvent('CustomEvent');
    tabEvent.which = 9;
    tabEvent.keyCode = 9;
    tabEvent.shiftKey = true;
    tabEvent.initEvent('keydown', true, true);

    document.querySelector('.sky-btn-primary').dispatchEvent(tabEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).toEqual(document.querySelector('input'));

    closeModal(modalInstance1);
  }));

  it('should handle tab when focus is in last item and in top modal', fakeAsync(() => {
    const modalInstance1 = openModal(ModalFooterTestComponent);

    const tabEvent: any = document.createEvent('CustomEvent');
    tabEvent.which = 9;
    tabEvent.keyCode = 9;
    tabEvent.shiftKey = false;
    tabEvent.initEvent('keydown', true, true);

    document.querySelector('.sky-btn-primary').dispatchEvent(tabEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).toEqual(
      document.querySelector('.sky-modal-btn-close')
    );

    closeModal(modalInstance1);
  }));

  it('should handle tab in content when in top modal', fakeAsync(() => {
    const modalInstance1 = openModal(ModalFooterTestComponent);

    const tabEvent: any = document.createEvent('CustomEvent');
    tabEvent.which = 9;
    tabEvent.keyCode = 9;
    tabEvent.shiftKey = false;
    tabEvent.initEvent('keydown', true, true);

    document.querySelector('input').dispatchEvent(tabEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).not.toEqual(
      document.querySelector('.sky-modal-btn-close')
    );

    closeModal(modalInstance1);
  }));

  it('should handle tab when modals are stacked', fakeAsync(() => {
    const modalInstance2 = openModal(ModalAutofocusTestComponent);
    const modalInstance1 = openModal(ModalFooterTestComponent);

    const tabEvent: any = document.createEvent('CustomEvent');
    tabEvent.which = 9;
    tabEvent.keyCode = 9;
    tabEvent.shiftKey = false;
    tabEvent.initEvent('keydown', true, true);

    document.querySelector('.sky-btn-primary').dispatchEvent(tabEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).toEqual(
      document.querySelector('.sky-modal-btn-close')
    );

    closeModal(modalInstance1);
    closeModal(modalInstance2);
  }));

  it('should handle a different key code', fakeAsync(() => {
    const modalInstance1 = openModal(ModalFooterTestComponent);

    const tabEvent: any = document.createEvent('CustomEvent');
    tabEvent.which = 3;
    tabEvent.keyCode = 3;
    tabEvent.shiftKey = false;
    tabEvent.initEvent('keydown', true, true);

    document.querySelector('.sky-btn-primary').dispatchEvent(tabEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).not.toEqual(
      document.querySelector('.sky-modal-btn-close')
    );

    closeModal(modalInstance1);
  }));

  it('handles no focusable elements', fakeAsync(() => {
    const modalInstance1 = openModal(ModalNoHeaderTestComponent);

    const tabEvent: any = document.createEvent('CustomEvent');
    tabEvent.which = 9;
    tabEvent.keyCode = 9;
    tabEvent.shiftKey = false;
    tabEvent.initEvent('keydown', true, true);

    document.dispatchEvent(tabEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).not.toEqual(
      document.querySelector('.sky-modal-btn-close')
    );

    closeModal(modalInstance1);
  }));

  it('should handle empty list for focus first and last element functions', fakeAsync(() => {
    const adapterService = new SkyModalComponentAdapterService(
      TestBed.inject(SkyCoreAdapterService)
    );
    const firstResult = adapterService.focusFirstElement([]);
    expect(firstResult).toBe(false);

    const lastResult = adapterService.focusLastElement([]);
    expect(lastResult).toBe(false);
  }));

  it('should close when the close button is clicked', fakeAsync(() => {
    openModal(ModalTestComponent);

    expect(document.querySelector('.sky-modal')).toExist();

    (document.querySelector('.sky-modal-btn-close') as HTMLElement).click();

    expect(document.querySelector('.sky-modal')).not.toExist();

    getApplicationRef().tick();
  }));

  it('should stop close event when beforeClose is subscribed to', fakeAsync(() => {
    const instance = openModal(ModalWithCloseConfirmTestComponent);
    expect(document.querySelector('.sky-modal')).toExist();

    (document.querySelector('.sky-modal-btn-close') as HTMLElement).click();
    tick();
    getApplicationRef().tick();
    expect(document.querySelector('.sky-modal')).toExist();

    const closeHandlerSpy = spyOn(
      instance.componentInstance,
      'beforeCloseHandler'
    ).and.callThrough();

    instance.close();
    tick();
    getApplicationRef().tick();
    expect(document.querySelector('.sky-modal')).toExist();

    // Verify the close handler has the correct data.
    const closeHandler =
      closeHandlerSpy.calls.allArgs()[0][0] as SkyModalBeforeCloseHandler;
    expect(typeof closeHandler.closeModal).toEqual('function');
    expect(closeHandler.closeArgs.reason).toEqual('close');
    expect(closeHandler.closeArgs.data).toBeUndefined();

    // Escape key
    const escapeEvent: any = document.createEvent('CustomEvent');
    escapeEvent.which = 27;
    escapeEvent.keyCode = 27;
    escapeEvent.initEvent('keyup', true, true);

    document.dispatchEvent(escapeEvent);

    tick();
    getApplicationRef().tick();
    expect(document.querySelector('.sky-modal')).toExist();

    // Confirm the close
    (document.querySelector('#toggle-btn') as HTMLElement).click();
    tick();
    getApplicationRef().tick();
    (document.querySelector('.sky-modal-btn-close') as HTMLElement).click();
    tick();
    getApplicationRef().tick();

    expect(document.querySelector('.sky-modal')).not.toExist();
    getApplicationRef().tick();
  }));

  it('should close the modal anyway if ignoreBeforeClose is passed in', fakeAsync(() => {
    const instance = openModal(ModalWithCloseConfirmTestComponent);
    expect(document.querySelector('.sky-modal')).toExist();

    instance.close('', '', true);
    tick();
    getApplicationRef().tick();

    expect(document.querySelector('.sky-modal')).not.toExist();
    getApplicationRef().tick();
  }));

  it('should close when the user navigates through history', fakeAsync(() => {
    openModal(ModalTestComponent);

    expect(document.querySelector('.sky-modal')).toExist();

    getRouter().navigate(['/']);

    expect(document.querySelector('.sky-modal')).not.toExist();

    getApplicationRef().tick();
  }));

  it('should not close on route change if it is already closed', fakeAsync(() => {
    const instance = openModal(ModalTestComponent);
    const closeSpy = spyOn(instance, 'close').and.callThrough();

    expect(document.querySelector('.sky-modal')).toExist();

    instance.close();
    expect(closeSpy).toHaveBeenCalled();
    closeSpy.calls.reset();

    getRouter().navigate(['/']);
    tick();

    expect(document.querySelector('.sky-modal')).not.toExist();
    expect(closeSpy).not.toHaveBeenCalled();

    getApplicationRef().tick();
  }));

  it('should trigger the help modal when the help button is clicked', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, {
      helpKey: 'default.html',
    });
    spyOn(modalInstance, 'openHelp').and.callThrough();

    expect(document.querySelector('.sky-modal')).toExist();

    (
      document.querySelector('button[name="help-button"]') as HTMLElement
    ).click();

    expect(modalInstance.openHelp).toHaveBeenCalledWith('default.html');

    getApplicationRef().tick();

    closeModal(modalInstance);
  }));

  it('should set max height based on window and change when window resizes', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent);
    const modalEl = document.querySelector('.sky-modal');
    let maxHeight = parseInt(getComputedStyle(modalEl).maxHeight, 10);
    const windowHeight = window.innerHeight;
    const contentEl = modalEl.querySelector('.sky-modal-content');

    const contentHeight = parseInt(getComputedStyle(contentEl).maxHeight, 10);

    expect(maxHeight).toEqual(windowHeight - 40);
    expect(contentHeight).toEqual(windowHeight - 40 - 114);

    SkyAppTestUtility.fireDomEvent(window, 'resize');
    getApplicationRef().tick();
    maxHeight = parseInt(getComputedStyle(modalEl).maxHeight, 10);
    expect(maxHeight).toEqual(window.innerHeight - 40);

    closeModal(modalInstance);
  }));

  it('should be a full screen modal and scale when window resizes', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, { fullPage: true });
    let modalEl = document.querySelector('.sky-modal-full-page');
    let height = parseInt(getComputedStyle(modalEl).height, 10);
    // innerHeight -2 is for IE Box Model Fix
    expect([window.innerHeight - 2, window.innerHeight]).toContain(height);
    SkyAppTestUtility.fireDomEvent(window, 'resize');
    getApplicationRef().tick();
    modalEl = document.querySelector('.sky-modal-full-page');
    height = parseInt(getComputedStyle(modalEl).height, 10);
    // innerHeight -2 is for IE Box Model Fix
    expect([window.innerHeight - 2, window.innerHeight]).toContain(height);

    closeModal(modalInstance);
  }));

  it('should not contain small,medium, or large classes in full size mode', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, { fullPage: true });

    expect(document.querySelector('.sky-modal-small')).not.toExist();
    expect(document.querySelector('.sky-modal-medium')).not.toExist();
    expect(document.querySelector('.sky-modal-large')).not.toExist();

    closeModal(modalInstance);
  }));

  it('should account for margins when setting full-page modal height', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, { fullPage: true });
    const modalEl = document.querySelector(
      '.sky-modal-full-page'
    ) as HTMLElement;

    modalEl.style.marginBottom = '20px';
    modalEl.style.marginTop = '20px';

    SkyAppTestUtility.fireDomEvent(window, 'resize');
    getApplicationRef().tick();

    const height = parseInt(getComputedStyle(modalEl).height, 10);

    // innerHeight -2 is for IE Box Model Fix
    expect([window.innerHeight - 2, window.innerHeight]).toContain(height + 40);

    closeModal(modalInstance);
  }));

  it('should default to medium size', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, { fullPage: false });

    expect(document.querySelector('.sky-modal-small')).not.toExist();
    expect(document.querySelector('.sky-modal-medium')).toExist();
    expect(document.querySelector('.sky-modal-large')).not.toExist();

    closeModal(modalInstance);
  }));

  it('should respect medium config setting size', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, {
      fullPage: false,
      size: 'medium',
    });

    expect(document.querySelector('.sky-modal-small')).not.toExist();
    expect(document.querySelector('.sky-modal-medium')).toExist();
    expect(document.querySelector('.sky-modal-large')).not.toExist();

    closeModal(modalInstance);
  }));

  it('should respect small config setting size', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, {
      fullPage: false,
      size: 'small',
    });

    expect(document.querySelector('.sky-modal-small')).toExist();
    expect(document.querySelector('.sky-modal-medium')).not.toExist();
    expect(document.querySelector('.sky-modal-large')).not.toExist();

    closeModal(modalInstance);
  }));

  it('should respect large config setting size', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, {
      fullPage: false,
      size: 'large',
    });

    expect(document.querySelector('.sky-modal-small')).not.toExist();
    expect(document.querySelector('.sky-modal-medium')).not.toExist();
    expect(document.querySelector('.sky-modal-large')).toExist();

    closeModal(modalInstance);
  }));

  it('should default the role, aria-labelledby, and aria-describedby', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent);

    expect(
      document.querySelector('.sky-modal-dialog').getAttribute('role')
    ).toBe('dialog');
    expect(
      document
        .querySelector('.sky-modal-dialog')
        .getAttribute('aria-labelledby')
        .indexOf('sky-modal-header-id-')
    ).not.toBe(-1);
    expect(
      document
        .querySelector('.sky-modal-dialog')
        .getAttribute('aria-describedby')
        .indexOf('sky-modal-content-id-')
    ).not.toBe(-1);
    closeModal(modalInstance);
  }));

  it('should accept configuration options for role, aria-labelledBy, and aria-describedby', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, {
      ariaLabelledBy: 'customlabelledby',
      ariaDescribedBy: 'customdescribedby',
      ariaRole: 'alertdialog',
    });

    expect(
      document.querySelector('.sky-modal-dialog').getAttribute('role')
    ).toBe('alertdialog');
    expect(
      document
        .querySelector('.sky-modal-dialog')
        .getAttribute('aria-labelledby')
    ).toBe('customlabelledby');
    expect(
      document
        .querySelector('.sky-modal-dialog')
        .getAttribute('aria-describedby')
    ).toBe('customdescribedby');

    closeModal(modalInstance);
  }));

  it('should default to tiled modal false', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, { tiledBody: false });

    expect(document.querySelector('.sky-modal-tiled')).not.toExist();

    closeModal(modalInstance);
  }));

  it('should accept configuration options for tiledBody', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, {
      tiledBody: true,
    });

    expect(document.querySelector('.sky-modal-tiled')).toExist();

    closeModal(modalInstance);
  }));

  it('should handle to tiledBody true', fakeAsync(() => {
    const modalInstance = openModal(ModalTiledBodyTestComponent);

    expect(document.querySelector('.sky-modal-tiled')).toExist();

    closeModal(modalInstance);
  }));

  it('should allow click events to bubble beyond host element', fakeAsync(function () {
    const modalInstance = openModal(ModalTiledBodyTestComponent);
    const modalElement = document.querySelector('.sky-modal');

    let numDocumentClicks = 0;
    document.addEventListener('click', function () {
      numDocumentClicks++;
    });

    let numModalClicks = 0;
    modalElement.addEventListener('click', function () {
      numModalClicks++;
    });

    SkyAppTestUtility.fireDomEvent(modalElement, 'click');

    expect(numDocumentClicks).toEqual(1);
    expect(numModalClicks).toEqual(1);

    closeModal(modalInstance);
  }));

  it('should not error when no theme service is provided', fakeAsync(() => {
    TestBed.overrideProvider(SkyThemeService, {
      useValue: undefined,
    });

    const modalInstance = openModal(ModalTiledBodyTestComponent);

    closeModal(modalInstance);
  }));

  it('should set the dock service location to between the modal content and footer', fakeAsync(() => {
    const dockServiceLocationSpy = spyOn(
      SkyDockService.prototype,
      'setDockOptions'
    );

    const modalInstance = openModal(ModalTestComponent);

    tick();
    getApplicationRef().tick();

    const modalContent = document.querySelector('.sky-modal-content');

    expect(dockServiceLocationSpy).toHaveBeenCalledWith({
      location: SkyDockLocation.ElementBottom,
      referenceEl: modalContent,
      zIndex: 5,
    });

    closeModal(modalInstance);
  }));

  describe('when modern theme', () => {
    let mutationObserverCreateSpy: jasmine.Spy;

    function scrollContent(contentEl: HTMLElement, top: number): void {
      contentEl.scrollTop = top;

      SkyAppTestUtility.fireDomEvent(contentEl, 'scroll');

      tick();
      getApplicationRef().tick();
    }

    function validateShadow(el: HTMLElement, expectedAlpha?: number): void {
      const boxShadowStyle = getComputedStyle(el).boxShadow;

      if (expectedAlpha) {
        const rgbaMatch = boxShadowStyle.match(
          /rgba\(0,\s*0,\s*0,\s*([0-9.]*)\)/
        );
        const alpha = parseFloat(rgbaMatch[1]);

        expect(expectedAlpha).toBeCloseTo(alpha, 2);
      } else {
        expect(boxShadowStyle).toBe('none');
      }
    }

    function setModernTheme(): void {
      const themeSvc: ModalMockThemeService =
        TestBed.inject<any>(SkyThemeService);

      themeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light
        ),
        previousSettings: themeSvc.settingsChange.value.currentSettings,
      });
    }

    beforeEach(() => {
      mutationObserverCreateSpy = spyOn(
        getMockMutationObserverService(),
        'create'
      ).and.callThrough();

      setModernTheme();
    });

    it('should progressively show a drop shadow as the modal content scrolls', fakeAsync(() => {
      const modalInstance1 = openModal(ModalTestComponent);

      const modalHeaderEl = document.querySelector(
        '.sky-modal-header'
      ) as HTMLElement;
      const modalContentEl = document.querySelector(
        '.sky-modal-content'
      ) as HTMLElement;
      const modalFooterEl = document.querySelector(
        '.sky-modal-footer'
      ) as HTMLElement;

      const fixtureContentEl = document.querySelector(
        '.modal-fixture-content'
      ) as HTMLElement;
      fixtureContentEl.style.height = `${window.innerHeight + 100}px`;

      scrollContent(modalContentEl, 0);
      validateShadow(modalHeaderEl);
      validateShadow(modalFooterEl, 0.3);

      scrollContent(modalContentEl, 15);
      validateShadow(modalHeaderEl, 0.15);
      validateShadow(modalFooterEl, 0.3);

      scrollContent(modalContentEl, 30);
      validateShadow(modalHeaderEl, 0.3);
      validateShadow(modalFooterEl, 0.3);

      scrollContent(modalContentEl, 31);
      validateShadow(modalHeaderEl, 0.3);
      validateShadow(modalFooterEl, 0.3);

      scrollContent(
        modalContentEl,
        modalContentEl.scrollHeight - 15 - modalContentEl.clientHeight
      );
      validateShadow(modalHeaderEl, 0.3);
      validateShadow(modalFooterEl, 0.15);

      scrollContent(
        modalContentEl,
        modalContentEl.scrollHeight - modalContentEl.clientHeight
      );
      validateShadow(modalHeaderEl, 0.3);
      validateShadow(modalFooterEl);

      closeModal(modalInstance1);
    }));

    it('should check for shadow when elements are added to the modal content', fakeAsync(() => {
      let mutateCallback: any;

      const fakeMutationObserver = {
        observe: jasmine.createSpy('observe'),
        disconnect: jasmine.createSpy('disconnect'),
      };

      mutationObserverCreateSpy.and.callFake((cb) => {
        mutateCallback = cb;

        return fakeMutationObserver;
      });

      const modalInstance1 = openModal(ModalTestComponent);

      const modalFooterEl = document.querySelector(
        '.sky-modal-footer'
      ) as HTMLElement;

      const fixtureContentEl = document.querySelector(
        '.modal-fixture-content'
      ) as HTMLElement;

      const childEl = document.createElement('div');
      childEl.style.height = `${window.innerHeight + 100}px`;
      childEl.style.backgroundColor = 'red';

      fixtureContentEl.appendChild(childEl);

      mutateCallback();

      tick();
      getApplicationRef().tick();

      validateShadow(modalFooterEl, 0.3);

      fixtureContentEl.removeChild(childEl);

      mutateCallback();

      tick();
      getApplicationRef().tick();

      validateShadow(modalFooterEl);

      closeModal(modalInstance1);
    }));

    it('should not create multiple mutation observers', fakeAsync(() => {
      const modalInstance1 = openModal(ModalTestComponent);

      setModernTheme();
      setModernTheme();
      setModernTheme();

      expect(mutationObserverCreateSpy.calls.count()).toBe(1);

      closeModal(modalInstance1);
    }));
  });
});
