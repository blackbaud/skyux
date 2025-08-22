import { ApplicationRef, StaticProvider } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyDockLocation,
  SkyDockService,
  SkyLiveAnnouncerService,
  SkyMutationObserverService,
} from '@skyux/core';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

import { ModalMockThemeService } from './fixtures/mock-theme.service';
import { ModalAutofocusTestComponent } from './fixtures/modal-autofocus.component.fixture';
import { ModalTestContext } from './fixtures/modal-context';
import { SkyModalFixturesModule } from './fixtures/modal-fixtures.module';
import { ModalFooterTestComponent } from './fixtures/modal-footer.component.fixture';
import { ModalIsDirtyTestContext } from './fixtures/modal-is-dirty-test-context.fixture';
import { ModalIsDirtyTestComponent } from './fixtures/modal-is-dirty.component.fixture';
import { ModalLauncherTestComponent } from './fixtures/modal-launcher.component.fixture';
import { ModalNoHeaderTestComponent } from './fixtures/modal-no-header.component.fixture';
import { ModalTiledBodyTestComponent } from './fixtures/modal-tiled-body.component.fixture';
import { ModalWithCloseConfirmTestComponent } from './fixtures/modal-with-close-confirm.component.fixture';
import { ModalWithFocusContentTestComponent } from './fixtures/modal-with-focus-content.fixture';
import { ModalWithFocusContext } from './fixtures/modal-with-focus-context.fixture';
import { ModalWithScrollingContentTestComponent } from './fixtures/modal-with-scrolling-content.fixture.component';
import { ModalTestComponent } from './fixtures/modal.component.fixture';
import { SkyModalBeforeCloseHandler } from './modal-before-close-handler';
import { SkyModalComponentAdapterService } from './modal-component-adapter.service';
import { SkyModalError } from './modal-error';
import { SkyModalHostComponent } from './modal-host.component';
import { SkyModalHostService } from './modal-host.service';
import { SkyModalInstance } from './modal-instance';
import { SkyModalConfigurationInterface } from './modal.interface';
import { SkyModalModule } from './modal.module';
import { SkyModalService } from './modal.service';

describe('Modal component', () => {
  function getFullPageModalElement(): HTMLElement {
    const fullPageModal = document.querySelector('.sky-modal-full-page');
    if (fullPageModal) {
      return fullPageModal as HTMLElement;
    } else {
      throw new Error('No full page modal found');
    }
  }

  function getInputElement(): HTMLElement {
    const inputElement = document.querySelector('input');
    if (inputElement) {
      return inputElement as HTMLElement;
    } else {
      throw new Error('No input element found');
    }
  }

  function getModalCloseButtonElement(): HTMLElement {
    const modalCloseButtonElement = document.querySelector(
      '.sky-modal-btn-close',
    );
    if (modalCloseButtonElement) {
      return modalCloseButtonElement as HTMLElement;
    } else {
      throw new Error('No modal close button found');
    }
  }

  function getModalContentElement(modalElement: HTMLElement): HTMLElement {
    const modalContentElement =
      modalElement.querySelector('.sky-modal-content');
    if (modalContentElement) {
      return modalContentElement as HTMLElement;
    } else {
      throw new Error('No modal content element found');
    }
  }

  function getModalHeaderContentElement(
    modalElement: HTMLElement,
  ): HTMLElement {
    const modalHeaderContentElement = modalElement.querySelector(
      '.sky-modal-header-content',
    );
    if (modalHeaderContentElement) {
      return modalHeaderContentElement as HTMLElement;
    } else {
      throw new Error('No modal header content element found');
    }
  }

  function getModalDialogElement(): HTMLElement {
    const modalDialog = document.querySelector('.sky-modal-dialog');
    if (modalDialog) {
      return modalDialog as HTMLElement;
    } else {
      throw new Error('No modal dialog element found');
    }
  }

  function getModalElement(): HTMLElement | undefined {
    return document.querySelector('.sky-modal') as HTMLElement;
  }

  function getPrimaryButton(): HTMLElement {
    const primaryButton = document.querySelector('.sky-btn-primary');
    if (primaryButton) {
      return primaryButton as HTMLElement;
    } else {
      throw new Error('No primary button found');
    }
  }

  function getApplicationRef(): ApplicationRef {
    return TestBed.inject(ApplicationRef);
  }

  function getModalService(): SkyModalService {
    return TestBed.inject(SkyModalService);
  }

  function getRouter(): Router {
    return TestBed.inject(Router);
  }

  function getHelpInlineButton(): HTMLButtonElement | null {
    return getModalElement()?.querySelector('sky-help-inline button') ?? null;
  }

  async function testLiveAnnouncer(
    changeElementAfterLoad = false,
  ): Promise<void> {
    const liveAnnouncer = TestBed.inject(SkyLiveAnnouncerService);
    // The live announcer element is created when an announcement is made. Doing this to create it.
    liveAnnouncer.announce('Creating element');
    const liveAnnouncerElement = document.querySelector(
      '.sky-live-announcer-element',
    );
    const modalInstance = openModal(ModalTestComponent, undefined, true);
    const modalDialogElement = getModalDialogElement();

    if (!liveAnnouncerElement) {
      fail(
        'Announcer element should have been set when live announcer was injected',
      );
      return;
    }

    expect(modalDialogElement.getAttribute('aria-owns')).toEqual(
      liveAnnouncerElement.id,
    );
    await expectAsync(getModalElement()).toBeAccessible();

    if (changeElementAfterLoad) {
      liveAnnouncer.announcerElementChanged.next({
        id: 'changedId',
      } as HTMLElement);

      getApplicationRef().tick();

      expect(modalDialogElement.getAttribute('aria-owns')).toEqual('changedId');
      await expectAsync(getModalElement()).toBeAccessible();
    }

    closeModal(modalInstance, true);
    liveAnnouncer.ngOnDestroy();
  }

  function openModal<T>(
    modalType: T,
    config?: SkyModalConfigurationInterface,
    async = false,
  ): SkyModalInstance {
    const modalInstance = getModalService().open(modalType, config);

    getApplicationRef().tick();

    if (!async) {
      tick();
    }

    return modalInstance;
  }

  function closeModal(modalInstance: SkyModalInstance, async = false): void {
    modalInstance.close();

    if (!async) {
      tick();
    }

    getApplicationRef().tick();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyModalFixturesModule, SkyHelpTestingModule],
      providers: [provideSkyMediaQueryTesting()],
    });

    document.body.style.setProperty(
      '--sky-elevation-overflow',
      '0 1px 8px 0 rgba(0, 0, 0, 0.3)',
    );

    // Confirm all modals are closed before another test is executed.
    expect(SkyModalHostService.openModalCount).toBe(0);
  });

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

  it('should assign zIndex correctly if a lower modal is closed while the upper modal is still open', fakeAsync(() => {
    const modalInstance1 = openModal(ModalTestComponent);
    const modalInstance2 = openModal(ModalTestComponent);

    let modalEls = document.querySelectorAll('.sky-modal');

    const zIndex1 = parseInt(getComputedStyle(modalEls[0]).zIndex, 10);
    let zIndex2 = parseInt(getComputedStyle(modalEls[1]).zIndex, 10);

    expect(zIndex1).toBe(80000000);
    expect(zIndex2).toBe(80001000);

    closeModal(modalInstance1);

    zIndex2 = parseInt(getComputedStyle(modalEls[1]).zIndex, 10);
    expect(zIndex2).toBe(80001000);

    const modalInstance3 = openModal(ModalTestComponent);

    modalEls = document.querySelectorAll('.sky-modal');
    zIndex2 = parseInt(getComputedStyle(modalEls[0]).zIndex, 10);
    const zIndex3 = parseInt(getComputedStyle(modalEls[1]).zIndex, 10);

    expect(zIndex2).toBe(80001000);
    expect(zIndex3).toBe(80002000);

    closeModal(modalInstance2);
    closeModal(modalInstance3);
  }));

  it('should assign zIndex correctly if all modals are closed and then a new modal is opened', fakeAsync(() => {
    const modalInstance1 = openModal(ModalTestComponent);
    const modalInstance2 = openModal(ModalTestComponent);

    let modalEls = document.querySelectorAll('.sky-modal');

    const zIndex1 = parseInt(getComputedStyle(modalEls[0]).zIndex, 10);
    const zIndex2 = parseInt(getComputedStyle(modalEls[1]).zIndex, 10);

    expect(zIndex1).toBe(80000000);
    expect(zIndex2).toBe(80001000);

    closeModal(modalInstance1);
    closeModal(modalInstance2);

    const modalInstance3 = openModal(ModalTestComponent);

    modalEls = document.querySelectorAll('.sky-modal');
    const zIndex3 = parseInt(getComputedStyle(modalEls[0]).zIndex, 10);

    expect(zIndex3).toBe(80000000);

    closeModal(modalInstance3);
  }));

  it('should focus the first focusable element when no autofocus is inside of content', fakeAsync(() => {
    const modalInstance1 = openModal(ModalWithFocusContentTestComponent);
    expect(document.activeElement).toEqual(
      document.querySelector('#visible-btn'),
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
      document.querySelector('#visible-btn-2'),
    );
    closeModal(modalInstance1);
  }));

  it('should focus the dialog when no autofocus or focus element is inside of content', fakeAsync(() => {
    const modalInstance1 = openModal(ModalTestComponent);
    expect(document.activeElement).toEqual(
      document.querySelector('.sky-modal-content'),
    );
    closeModal(modalInstance1);
  }));

  it('should focus the dialog when all focusable elements are disabled', fakeAsync(() => {
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
      document.querySelector('.sky-modal-content'),
    );
    closeModal(modalInstance1);
  }));

  it('should focus the autofocus element when autofocus is inside of content', fakeAsync(() => {
    const modalInstance1 = openModal(ModalAutofocusTestComponent);
    expect(document.activeElement).toEqual(
      document.querySelector('#autofocus-el'),
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

    expect(getModalElement()).not.toExist();
  }));

  it('should handle escape when modals are stacked', fakeAsync(() => {
    const modalInstance2 = openModal(ModalAutofocusTestComponent);
    const modalInstance1 = openModal(ModalFooterTestComponent);

    const escapeEvent: any = document.createEvent('CustomEvent');
    escapeEvent.which = 27;
    escapeEvent.keyCode = 27;
    escapeEvent.shiftKey = false;
    escapeEvent.initEvent('keyup', true, true);

    let modalElement = getModalElement();

    if (!modalElement) {
      throw new Error('No modal element found');
    }

    modalElement.dispatchEvent(escapeEvent);
    modalElement.dispatchEvent(escapeEvent);

    tick();
    getApplicationRef().tick();

    modalElement = getModalElement();

    expect(modalElement).not.toExist();

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

    getPrimaryButton().dispatchEvent(unknownEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).not.toEqual(getModalCloseButtonElement());
    expect(getModalElement()).toExist();

    closeModal(modalInstance1);
  }));

  it('should handle tab with shift when focus is on modal and in top modal', fakeAsync(() => {
    const modalInstance1 = openModal(ModalFooterTestComponent);
    const tabEvent: any = document.createEvent('CustomEvent');
    tabEvent.which = 9;
    tabEvent.keyCode = 9;
    tabEvent.shiftKey = true;
    tabEvent.initEvent('keydown', true, true);

    getModalDialogElement().dispatchEvent(tabEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).toEqual(getPrimaryButton());

    closeModal(modalInstance1);
  }));

  it('should handle tab with shift when focus is in first item and in top modal', fakeAsync(() => {
    const modalInstance1 = openModal(ModalFooterTestComponent);

    const tabEvent: any = document.createEvent('CustomEvent');
    tabEvent.which = 9;
    tabEvent.keyCode = 9;
    tabEvent.shiftKey = true;
    tabEvent.initEvent('keydown', true, true);

    getModalCloseButtonElement().dispatchEvent(tabEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).toEqual(getPrimaryButton());

    closeModal(modalInstance1);
  }));

  it('should handle tab with shift when focus is in last item and in top modal', fakeAsync(() => {
    const modalInstance1 = openModal(ModalFooterTestComponent);

    const tabEvent: any = document.createEvent('CustomEvent');
    tabEvent.which = 9;
    tabEvent.keyCode = 9;
    tabEvent.shiftKey = true;
    tabEvent.initEvent('keydown', true, true);

    getPrimaryButton().dispatchEvent(tabEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).toEqual(getInputElement());

    closeModal(modalInstance1);
  }));

  it('should handle tab when focus is in last item and in top modal', fakeAsync(() => {
    const modalInstance1 = openModal(ModalFooterTestComponent);

    const tabEvent: any = document.createEvent('CustomEvent');
    tabEvent.which = 9;
    tabEvent.keyCode = 9;
    tabEvent.shiftKey = false;
    tabEvent.initEvent('keydown', true, true);

    getPrimaryButton().dispatchEvent(tabEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).toEqual(getModalCloseButtonElement());

    closeModal(modalInstance1);
  }));

  it('should handle tab in content when in top modal', fakeAsync(() => {
    const modalInstance1 = openModal(ModalFooterTestComponent);

    const tabEvent: any = document.createEvent('CustomEvent');
    tabEvent.which = 9;
    tabEvent.keyCode = 9;
    tabEvent.shiftKey = false;
    tabEvent.initEvent('keydown', true, true);

    getInputElement().dispatchEvent(tabEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).not.toEqual(getModalCloseButtonElement());

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

    getPrimaryButton().dispatchEvent(tabEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).toEqual(getModalCloseButtonElement());

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

    getPrimaryButton().dispatchEvent(tabEvent);

    tick();
    getApplicationRef().tick();

    expect(document.activeElement).not.toEqual(getModalCloseButtonElement());

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

    expect(document.activeElement).not.toEqual(getModalCloseButtonElement());

    closeModal(modalInstance1);
  }));

  it('should handle empty list for focus first and last element functions', fakeAsync(() => {
    const adapterService = new SkyModalComponentAdapterService();
    const firstResult = adapterService.focusFirstElement([]);
    expect(firstResult).toBe(false);

    const lastResult = adapterService.focusLastElement([]);
    expect(lastResult).toBe(false);
  }));

  it('should close when the close button is clicked', fakeAsync(() => {
    openModal(ModalTestComponent);

    expect(getModalElement()).toExist();

    (getModalCloseButtonElement() as HTMLElement).click();

    expect(getModalElement()).not.toExist();

    getApplicationRef().tick();
  }));

  it('should stop close event when beforeClose is subscribed to', fakeAsync(() => {
    const instance = openModal(ModalWithCloseConfirmTestComponent);
    expect(getModalElement()).toExist();

    (getModalCloseButtonElement() as HTMLElement).click();
    tick();
    getApplicationRef().tick();
    expect(getModalElement()).toExist();

    const closeHandlerSpy = spyOn(
      instance.componentInstance,
      'beforeCloseHandler',
    ).and.callThrough();

    instance.close();
    tick();
    getApplicationRef().tick();
    expect(getModalElement()).toExist();

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
    expect(getModalElement()).toExist();

    // Confirm the close
    (document.querySelector('#toggle-btn') as HTMLElement).click();
    tick();
    getApplicationRef().tick();
    (getModalCloseButtonElement() as HTMLElement).click();
    tick();
    getApplicationRef().tick();

    expect(getModalElement()).not.toExist();
    getApplicationRef().tick();
  }));

  it('should close the modal anyway if ignoreBeforeClose is passed in', fakeAsync(() => {
    const instance = openModal(ModalWithCloseConfirmTestComponent);
    expect(getModalElement()).toExist();

    instance.close('', '', true);
    tick();
    getApplicationRef().tick();

    expect(getModalElement()).not.toExist();
    getApplicationRef().tick();
  }));

  it('should close when the user navigates through history', fakeAsync(async () => {
    openModal(ModalTestComponent);

    expect(getModalElement()).toExist();

    await getRouter().navigate(['/']);

    expect(getModalElement()).not.toExist();

    getApplicationRef().tick();
  }));

  it('should not require Router provider', fakeAsync(() => {
    TestBed.overrideComponent(SkyModalHostComponent, {
      add: {
        providers: [
          {
            provide: Router,
            useValue: undefined,
          },
        ],
      },
    });

    const modalInstance = openModal(ModalTestComponent);
    closeModal(modalInstance);
  }));

  it('should not close on route change if it is already closed', fakeAsync(async () => {
    const instance = openModal(ModalTestComponent);
    const closeSpy = spyOn(instance, 'close').and.callThrough();

    expect(getModalElement()).toExist();

    instance.close();
    expect(closeSpy).toHaveBeenCalled();
    closeSpy.calls.reset();

    await getRouter().navigate(['/']);
    tick();

    expect(getModalElement()).not.toExist();
    expect(closeSpy).not.toHaveBeenCalled();

    getApplicationRef().tick();
  }));

  it('should trigger the help modal when the help button is clicked', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, {
      helpKey: 'default.html',
    });
    spyOn(modalInstance, 'openHelp').and.callThrough();

    expect(getModalElement()).toExist();

    (
      document.querySelector('button[name="help-button"]') as HTMLElement
    ).click();

    expect(modalInstance.openHelp).toHaveBeenCalledWith('default.html');

    getApplicationRef().tick();

    closeModal(modalInstance);
  }));

  it('should render help inline popover', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, {
      providers: [
        {
          provide: ModalTestContext,
          useValue: {
            headingText: 'My modal',
            helpPopoverContent: 'Popover content here.',
          } satisfies Partial<ModalTestContext>,
        },
      ],
    });

    expect(getHelpInlineButton()).toExist();

    closeModal(modalInstance);
  }));

  it('should not render help inline if popover content provided but headingText undefined', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, {
      providers: [
        {
          provide: ModalTestContext,
          useValue: {
            headingText: undefined,
            helpPopoverContent: 'Popover content here.',
          } satisfies Partial<ModalTestContext>,
        },
      ],
    });

    expect(getHelpInlineButton()).toBeNull();

    closeModal(modalInstance);
  }));

  it('should render help inline when helpKey is provided', fakeAsync(() => {
    const helpController = TestBed.inject(SkyHelpTestingController);

    const modalInstance = openModal(ModalTestComponent, {
      providers: [
        {
          provide: ModalTestContext,
          useValue: {
            headingText: 'My modal',
            helpKey: 'foo.html',
          } satisfies Partial<ModalTestContext>,
        },
      ],
    });

    getHelpInlineButton()?.click();
    getApplicationRef().tick();

    helpController.expectCurrentHelpKey('foo.html');

    closeModal(modalInstance);
  }));

  it('should not render help inline if helpKey provided but heading text undefined', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, {
      providers: [
        {
          provide: ModalTestContext,
          useValue: {
            headingText: undefined,
            helpKey: 'foo.html',
          } satisfies Partial<ModalTestContext>,
        },
      ],
    });

    expect(getHelpInlineButton()).toBeNull();

    closeModal(modalInstance);
  }));

  it('should set max height based on window and change when window resizes', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent);
    const modalEl = getModalElement();

    if (!modalEl) {
      throw new Error('No modal element found');
    }

    let maxHeight = parseInt(getComputedStyle(modalEl).maxHeight, 10);
    const windowHeight = window.innerHeight;

    expect(maxHeight).toEqual(windowHeight - 40);

    SkyAppTestUtility.fireDomEvent(window, 'resize');
    getApplicationRef().tick();
    maxHeight = parseInt(getComputedStyle(modalEl).maxHeight, 10);
    expect(maxHeight).toEqual(window.innerHeight - 40);

    closeModal(modalInstance);
  }));

  it('should be a full screen modal and scale when window resizes', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, { fullPage: true });
    let modalEl = getFullPageModalElement();
    let height = parseInt(getComputedStyle(modalEl).height, 10);
    // innerHeight -2 is for IE Box Model Fix
    expect([window.innerHeight - 2, window.innerHeight]).toContain(height);
    SkyAppTestUtility.fireDomEvent(window, 'resize');
    getApplicationRef().tick();
    modalEl = getFullPageModalElement();
    height = parseInt(getComputedStyle(modalEl).height, 10);
    // innerHeight -2 is for IE Box Model Fix
    expect([window.innerHeight - 2, window.innerHeight]).toContain(height);

    closeModal(modalInstance);
  }));

  it('should not contain small, medium, or large classes in full size mode', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, { fullPage: true });

    expect(document.querySelector('.sky-modal-small')).not.toExist();
    expect(document.querySelector('.sky-modal-medium')).not.toExist();
    expect(document.querySelector('.sky-modal-large')).not.toExist();

    closeModal(modalInstance);
  }));

  it('should contain responsive size class', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent);

    TestBed.inject(SkyMediaQueryTestingController).setBreakpoint('xs');

    expect(document.querySelector('.sky-responsive-container-xs')).toExist();

    closeModal(modalInstance);
  }));

  it('should account for margins when setting full-page modal height', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, { fullPage: true });
    const modalEl = document.querySelector(
      '.sky-modal-full-page',
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
    const modalDialogElement = getModalDialogElement();

    expect(modalDialogElement.getAttribute('role')).toBe('dialog');
    expect(modalDialogElement.getAttribute('aria-labelledby')).toBe(
      getModalHeaderContentElement(modalDialogElement).id,
    );
    expect(modalDialogElement.getAttribute('aria-describedby')).toBe(
      getModalContentElement(modalDialogElement).id,
    );
    closeModal(modalInstance);
  }));

  it('should accept configuration options for role, aria-labelledBy, and aria-describedby', fakeAsync(() => {
    const modalInstance = openModal(ModalTestComponent, {
      ariaLabelledBy: 'customLabelledBy',
      ariaDescribedBy: 'customDescribedBy',
      ariaRole: 'alertdialog',
    });

    expect(getModalDialogElement().getAttribute('role')).toBe('alertdialog');
    expect(getModalDialogElement().getAttribute('aria-labelledby')).toBe(
      'customLabelledBy',
    );
    expect(getModalDialogElement().getAttribute('aria-describedby')).toBe(
      'customDescribedBy',
    );

    closeModal(modalInstance);
  }));

  it('should set the aria-owns property to contain the id of the live announce element if it exists', async () => {
    await testLiveAnnouncer();
  });

  it('should update the aria-owns property to contain the id of the live announce element if it changes', async () => {
    await testLiveAnnouncer(true);
  });

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
    const modalElement = getModalElement();

    if (!modalElement) {
      throw new Error('No modal element found');
    }

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
      'setDockOptions',
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

  it('should display and hide error messages in the footer and be accessible', async () => {
    const modalInstance = openModal(ModalFooterTestComponent, undefined, true);
    const errors: SkyModalError[] = [
      { message: 'Test error' },
      { message: 'Test error 2' },
    ];

    let errorsComponent = document.querySelector('.sky-modal-footer-errors');
    let errorEls = document.querySelectorAll('.sky-status-indicator');
    expect(errorsComponent).toBeNull();
    expect(errorEls.length).toBe(0);

    modalInstance.componentInstance.errors = [];
    getApplicationRef().tick();

    errorsComponent = document.querySelector('.sky-modal-footer-errors');
    errorEls = document.querySelectorAll('.sky-status-indicator');
    expect(errorsComponent).toBeNull();
    expect(errorEls.length).toBe(0);

    modalInstance.componentInstance.errors = errors;
    getApplicationRef().tick();

    errorsComponent = document.querySelector('.sky-modal-footer-errors');
    expect(errorsComponent).not.toBeNull();
    errorEls = document.querySelectorAll('.sky-status-indicator');
    errorEls.forEach((el, i) => {
      expect(el.textContent).toEqual(` Error: ${errors[i].message}`);
    });

    await expectAsync(getModalElement()).toBeAccessible();
  });

  describe('scroll shadow', () => {
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
          /rgba\(0,\s*0,\s*0,\s*([0-9.]*)\)/,
        );

        if (!(rgbaMatch && rgbaMatch[1])) {
          fail('No shadow found');
        } else {
          const alpha = parseFloat(rgbaMatch[1]);

          expect(expectedAlpha).toBeCloseTo(alpha, 2);
        }
      } else {
        expect(boxShadowStyle).toBe('none');
      }
    }

    function setModernTheme(): void {
      const themeSvc = TestBed.inject(
        SkyThemeService,
      ) as unknown as ModalMockThemeService;

      themeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
        ),
        previousSettings: themeSvc.settingsChange.value.currentSettings,
      });
    }

    function triggerMutation(
      mutateCallback: MutationCallback | undefined,
      mutationObserver: MutationObserver,
    ): void {
      if (mutateCallback) {
        mutateCallback([], mutationObserver);
      } else {
        fail('Mutation callback is not defined.');
      }
    }

    describe('when default theme', () => {
      it('should not show a drop shadow as the modal content scrolls', fakeAsync(() => {
        const modalInstance1 = openModal(ModalTestComponent);

        const modalHeaderEl = document.querySelector(
          '.sky-modal-header',
        ) as HTMLElement;
        const modalContentEl = document.querySelector(
          '.sky-modal-content',
        ) as HTMLElement;
        const modalFooterEl = document.querySelector(
          '.sky-modal-footer',
        ) as HTMLElement;

        const fixtureContentEl = document.querySelector(
          '.modal-fixture-content',
        ) as HTMLElement;
        fixtureContentEl.style.height = `${window.innerHeight + 100}px`;

        scrollContent(modalContentEl, 0);
        validateShadow(modalHeaderEl);
        validateShadow(modalFooterEl);

        scrollContent(modalContentEl, 15);
        validateShadow(modalHeaderEl);
        validateShadow(modalFooterEl);

        scrollContent(modalContentEl, 30);
        validateShadow(modalHeaderEl);
        validateShadow(modalFooterEl);

        scrollContent(modalContentEl, 31);
        validateShadow(modalHeaderEl);
        validateShadow(modalFooterEl);

        scrollContent(
          modalContentEl,
          modalContentEl.scrollHeight - 15 - modalContentEl.clientHeight,
        );
        validateShadow(modalHeaderEl);
        validateShadow(modalFooterEl);

        scrollContent(
          modalContentEl,
          modalContentEl.scrollHeight - modalContentEl.clientHeight,
        );
        validateShadow(modalHeaderEl);
        validateShadow(modalFooterEl);

        closeModal(modalInstance1);
      }));

      it('should not check for shadow when elements are added to the modal content', fakeAsync(() => {
        let mutateCallback: MutationCallback | undefined;

        const fakeMutationObserver: MutationObserver = {
          observe: jasmine.createSpy('observe'),
          disconnect: jasmine.createSpy('disconnect'),
          takeRecords: jasmine.createSpy('takeRecords'),
        };

        spyOn(
          TestBed.inject(SkyMutationObserverService),
          'create',
        ).and.callFake((cb) => {
          mutateCallback = cb;

          return fakeMutationObserver;
        });

        const modalInstance1 = openModal(ModalTestComponent);

        const modalFooterEl = document.querySelector(
          '.sky-modal-footer',
        ) as HTMLElement;

        const fixtureContentEl = document.querySelector(
          '.modal-fixture-content',
        ) as HTMLElement;

        const childEl = document.createElement('div');
        childEl.style.height = `${window.innerHeight + 100}px`;
        childEl.style.backgroundColor = 'red';

        fixtureContentEl.appendChild(childEl);

        triggerMutation(mutateCallback, fakeMutationObserver);

        tick();
        getApplicationRef().tick();

        validateShadow(modalFooterEl);

        fixtureContentEl.removeChild(childEl);

        triggerMutation(mutateCallback, fakeMutationObserver);

        tick();
        getApplicationRef().tick();

        validateShadow(modalFooterEl);

        closeModal(modalInstance1);
      }));
    });

    describe('when modern theme', () => {
      it('should progressively show a drop shadow as the modal content scrolls', fakeAsync(() => {
        setModernTheme();

        const modalInstance1 = openModal(ModalTestComponent);

        const modalHeaderEl = document.querySelector(
          '.sky-modal-header',
        ) as HTMLElement;
        const modalContentEl = document.querySelector(
          '.sky-modal-content',
        ) as HTMLElement;
        const modalFooterEl = document.querySelector(
          '.sky-modal-footer',
        ) as HTMLElement;

        const fixtureContentEl = document.querySelector(
          '.modal-fixture-content',
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
          modalContentEl.scrollHeight - 15 - modalContentEl.clientHeight,
        );
        validateShadow(modalHeaderEl, 0.3);
        validateShadow(modalFooterEl, 0.15);

        scrollContent(
          modalContentEl,
          modalContentEl.scrollHeight - modalContentEl.clientHeight,
        );
        validateShadow(modalHeaderEl, 0.3);
        validateShadow(modalFooterEl);

        closeModal(modalInstance1);
      }));

      it('should check for shadow when elements are added to the modal content', fakeAsync(() => {
        let mutateCallback: MutationCallback | undefined;

        const fakeMutationObserver: MutationObserver = {
          observe: jasmine.createSpy('observe'),
          disconnect: jasmine.createSpy('disconnect'),
          takeRecords: jasmine.createSpy('takeRecords'),
        };

        spyOn(
          TestBed.inject(SkyMutationObserverService),
          'create',
        ).and.callFake((cb) => {
          mutateCallback = cb;

          return fakeMutationObserver;
        });

        setModernTheme();

        const modalInstance1 = openModal(ModalTestComponent);

        const modalFooterEl = document.querySelector(
          '.sky-modal-footer',
        ) as HTMLElement;

        const fixtureContentEl = document.querySelector(
          '.modal-fixture-content',
        ) as HTMLElement;

        const childEl = document.createElement('div');
        childEl.style.height = `${window.innerHeight + 100}px`;
        childEl.style.backgroundColor = 'red';

        fixtureContentEl.appendChild(childEl);

        triggerMutation(mutateCallback, fakeMutationObserver);

        tick();
        getApplicationRef().tick();

        validateShadow(modalFooterEl, 0.3);

        fixtureContentEl.removeChild(childEl);

        triggerMutation(mutateCallback, fakeMutationObserver);

        tick();
        getApplicationRef().tick();

        validateShadow(modalFooterEl);

        closeModal(modalInstance1);
      }));
    });
  });

  it('should pass accessibility with scrolling content', async () => {
    const fixture = TestBed.createComponent(ModalLauncherTestComponent);

    fixture.detectChanges();
    fixture.componentInstance.launchModal(
      ModalWithScrollingContentTestComponent,
    );
    fixture.detectChanges();

    await expectAsync(
      document.querySelector('.sky-modal-dialog'),
    ).toBeAccessible();
  });

  describe('Is dirty directive', () => {
    function getConfirmModalElement(): HTMLElement | null {
      return document.querySelector('.sky-confirm');
    }

    function getDiscardButtonElement(
      confirmModalEl: HTMLElement,
    ): HTMLButtonElement | null {
      return confirmModalEl.querySelector('.sky-btn-primary');
    }

    function getKeepWorkingButtonElement(
      confirmModalEl: HTMLElement,
    ): HTMLButtonElement | null {
      return confirmModalEl.querySelector('.sky-btn-link');
    }

    async function checkConfirmModalIsCorrect(
      confirmModalEl: HTMLElement,
    ): Promise<void> {
      const messageEl = confirmModalEl.querySelector('.sky-confirm-message');
      await expectAsync(messageEl).toHaveLibResourceText(
        'skyux_modal_dirty_default_message',
      );

      const discardButtonEl = getDiscardButtonElement(confirmModalEl);
      await expectAsync(discardButtonEl).toHaveLibResourceText(
        'skyux_modal_dirty_default_discard_changes_text',
      );

      const keepWorkingButtonEl = getKeepWorkingButtonElement(confirmModalEl);
      await expectAsync(keepWorkingButtonEl).toHaveLibResourceText(
        'skyux_modal_dirty_default_keep_working_text',
      );
    }

    let dirtyContextProvider: { providers: StaticProvider[] };

    beforeEach(() => {
      dirtyContextProvider = {
        providers: [
          {
            provide: ModalIsDirtyTestContext,
            useValue: {
              isDirty: true,
            },
          },
        ],
      };
    });

    it('should not prompt to discard if not dirty', fakeAsync(() => {
      const modalInstance = openModal(ModalIsDirtyTestComponent);
      closeModal(modalInstance);
      expect(getConfirmModalElement()).toBeNull();
    }));

    it('should not prompt to discard if dirty but saving', fakeAsync(() => {
      const modalInstance = openModal(
        ModalIsDirtyTestComponent,
        dirtyContextProvider,
      );
      modalInstance.save();
      expect(getConfirmModalElement()).toBeNull();
    }));

    it('should prompt to discard if canceling when dirty and stay open when keep working is selected', fakeAsync(async () => {
      const modalInstance = openModal(
        ModalIsDirtyTestComponent,
        dirtyContextProvider,
      );
      modalInstance.cancel();

      const confirmModalEl = getConfirmModalElement();
      expect(confirmModalEl).not.toBeNull();

      if (confirmModalEl) {
        await checkConfirmModalIsCorrect(confirmModalEl);
        getKeepWorkingButtonElement(confirmModalEl)?.click();
        expect(getModalElement()).not.toBeNull();
      }
    }));

    it('should prompt to discard if canceling when dirty and close when discard changes is selected', fakeAsync(async () => {
      const modalInstance = openModal(
        ModalIsDirtyTestComponent,
        dirtyContextProvider,
      );
      closeModal(modalInstance);

      const confirmModalEl = getConfirmModalElement();
      expect(confirmModalEl).not.toBeNull();

      if (confirmModalEl) {
        await checkConfirmModalIsCorrect(confirmModalEl);
        getDiscardButtonElement(confirmModalEl)?.click();
        expect(getModalElement()).toBeNull();
      }
    }));

    it('should prompt to discard if closing when dirty and stay open when keep working is selected', fakeAsync(async () => {
      const modalInstance = openModal(
        ModalIsDirtyTestComponent,
        dirtyContextProvider,
      );
      closeModal(modalInstance);

      const confirmModalEl = getConfirmModalElement();
      expect(confirmModalEl).not.toBeNull();

      if (confirmModalEl) {
        await checkConfirmModalIsCorrect(confirmModalEl);
        getKeepWorkingButtonElement(confirmModalEl)?.click();
        expect(getModalElement()).not.toBeNull();
      }
    }));

    it('should prompt to discard if closing when dirty and close when discard changes is selected', fakeAsync(async () => {
      const modalInstance = openModal(
        ModalIsDirtyTestComponent,
        dirtyContextProvider,
      );
      closeModal(modalInstance);

      const confirmModalEl = getConfirmModalElement();
      expect(confirmModalEl).not.toBeNull();

      if (confirmModalEl) {
        await checkConfirmModalIsCorrect(confirmModalEl);
        getDiscardButtonElement(confirmModalEl)?.click();
        expect(getModalElement()).toBeNull();
      }
    }));
  });
});

describe('Modal component (created w/o SkyModalService)', () => {
  it('should setup a default modal configuration', () => {
    TestBed.configureTestingModule({
      declarations: [ModalTestComponent],
      imports: [SkyModalModule],
      providers: [
        {
          provide: SkyModalHostService,
          useValue: {
            onClose: (): void => {
              /** */
            },
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(ModalTestComponent);

    fixture.detectChanges();

    // Medium is the default size for modals.
    expect(fixture.nativeElement.querySelector('.sky-modal-medium')).toExist();

    // Close the modal.
    fixture.nativeElement.querySelector('.sky-modal-btn-close').click();
  });
});
