import { ApplicationRef } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  inject,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';
import { SkyUIConfigService } from '@skyux/core';
import { SkyModalService } from '@skyux/modals';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import {
  BehaviorSubject,
  of as observableOf,
  throwError as observableThrow,
} from 'rxjs';

import { SkyFlyoutFixturesModule } from './fixtures/flyout-fixtures.module';
import { SkyFlyoutTestSampleContext } from './fixtures/flyout-sample-context.fixture';
import { SkyFlyoutTestComponent } from './fixtures/flyout.component.fixture';
import { SkyFlyoutInstance } from './flyout-instance';
import { SkyFlyoutMediaQueryService } from './flyout-media-query.service';
import { SkyFlyoutComponent } from './flyout.component';
import { SkyFlyoutService } from './flyout.service';
import { SkyFlyoutConfig } from './types/flyout-config';

describe('Flyout component', () => {
  let applicationRef: ApplicationRef;
  let fixture: ComponentFixture<SkyFlyoutTestComponent>;
  let flyoutService: SkyFlyoutService;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  let windowSizeSpy: jasmine.Spy;

  //#region helpers
  function openFlyout(
    config: SkyFlyoutConfig = {},
    context?: SkyFlyoutTestSampleContext
  ): SkyFlyoutInstance<any> {
    config = Object.assign(
      {
        providers: [
          {
            provide: SkyFlyoutTestSampleContext,
            useValue: context ? context : { name: 'Sam' },
          },
        ],
      },
      config
    );

    const flyoutInstance = fixture.componentInstance.openFlyout(config);

    applicationRef.tick();
    tick();
    fixture.detectChanges();

    return flyoutInstance;
  }

  function openHostFlyout(): SkyFlyoutInstance<any> {
    const flyoutInstance = fixture.componentInstance.openHostsFlyout();

    applicationRef.tick();
    tick();
    fixture.detectChanges();

    return flyoutInstance;
  }

  function closeFlyout(): void {
    const closeButton = getCloseButtonElement();
    closeButton.click();
    tick();
    fixture.detectChanges();
    tick();
    // Second detection allows for the flyout service to remove the flyout host when appropriate
    fixture.detectChanges();
    tick();
  }

  function makeEvent(eventType: string, evtObj: any): void {
    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(
      eventType,
      false,
      false,
      window,
      0,
      0,
      0,
      evtObj.clientX,
      0,
      false,
      false,
      false,
      false,
      0,
      undefined
    );
    document.dispatchEvent(evt);
  }

  function grabDragHandle(handleXCord: number): void {
    const handleElement = getFlyoutHandleElement();
    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(
      'mousedown',
      false,
      false,
      window,
      0,
      0,
      0,
      handleXCord,
      0,
      false,
      false,
      false,
      false,
      0,
      undefined
    );

    handleElement.dispatchEvent(evt);
  }

  function grabHeaderDragHandle(handleXCord: number): void {
    const handleElement = getFlyoutHeaderGrabHandle();
    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(
      'mousedown',
      false,
      false,
      window,
      0,
      0,
      0,
      handleXCord,
      0,
      false,
      false,
      false,
      false,
      0,
      undefined
    );

    handleElement.dispatchEvent(evt);
  }

  function dragHandle(endingXCord: number): void {
    makeEvent('mousemove', { clientX: endingXCord });
    fixture.detectChanges();
    tick();
  }

  function releaseDragHandle(): void {
    makeEvent('mouseup', {});
    fixture.detectChanges();
    tick();

    SkyAppTestUtility.fireDomEvent(document, 'click');
    fixture.detectChanges();
    tick();
  }

  function resizeFlyout(startingXCord: number, endingXCord: number): void {
    grabDragHandle(startingXCord);
    dragHandle(endingXCord);
    releaseDragHandle();
  }

  function resizeFlyoutWithHeaderGrabHandle(
    startingXCord: number,
    endingXCord: number
  ): void {
    grabHeaderDragHandle(startingXCord);
    dragHandle(endingXCord);
    releaseDragHandle();
  }

  function fireKeyDownOnHeaderGrabHandle(keyName: string): void {
    const handleElement = getFlyoutHeaderGrabHandle();
    SkyAppTestUtility.fireDomEvent(handleElement, 'keydown', {
      keyboardEventInit: { key: keyName },
    });
    fixture.detectChanges();
    tick();
  }

  function fireKeyDownOnSeparatorHandle(keyName: string): void {
    const flyoutElement = getFlyoutElement();
    const handle = getFlyoutHandleElement();
    SkyAppTestUtility.fireDomEvent(handle, 'keydown', {
      keyboardEventInit: { key: keyName },
    });
    fixture.detectChanges();
    tick();
  }

  function getFlyoutElement(): HTMLElement {
    return document.querySelector('.sky-flyout') as HTMLElement;
  }

  function getFlyoutHostElement(): HTMLElement {
    return document.querySelector('sky-flyout') as HTMLElement;
  }

  function getFlyoutHandleElement(): HTMLElement {
    return document.querySelector('.sky-flyout-resize-handle') as HTMLElement;
  }

  function getFlyoutHeaderGrabHandle(): HTMLElement {
    return document.querySelector(
      '.sky-flyout-header-grab-handle'
    ) as HTMLElement;
  }

  function getFlyoutHeaderElement(): HTMLElement {
    return document.querySelector('.sky-flyout-header') as HTMLElement;
  }

  function getFlyoutTriggerElement(): HTMLElement {
    return document.querySelector('#flyout-trigger-button') as HTMLElement;
  }

  function getCloseButtonElement(): HTMLElement {
    return document.querySelector('.sky-flyout-btn-close') as HTMLElement;
  }

  function getPermalinkButtonElement(): HTMLElement {
    return document.querySelector('.sky-flyout-btn-permalink') as HTMLElement;
  }

  function getPrimaryActionButtonElement(): HTMLElement {
    return document.querySelector(
      '.sky-flyout-btn-primary-action'
    ) as HTMLElement;
  }

  function getFlyoutModalTriggerElement(): HTMLElement {
    return document.querySelector('#modal-trigger') as HTMLElement;
  }

  function getModalElement(): HTMLElement {
    return document.querySelector('.sky-modal-content') as HTMLElement;
  }

  function closeModal(): void {
    (document.querySelector('.sky-modal-btn-close') as HTMLElement).click();
  }

  function getFlyoutToastTriggerElement(): HTMLElement {
    return document.querySelector('#toast-trigger') as HTMLElement;
  }

  function getToastElement(): HTMLElement {
    return document.querySelector('.sky-toast-content') as HTMLElement;
  }

  function closeToast(): void {
    (document.querySelector('.sky-toast-btn-close') as HTMLElement).click();
  }

  function getIframe(): HTMLElement {
    return document.querySelector('iframe') as HTMLElement;
  }
  //#endregion

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      imports: [SkyFlyoutFixturesModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });

    fixture = TestBed.createComponent(SkyFlyoutTestComponent);
    fixture.detectChanges();

    windowSizeSpy = spyOnProperty(window, 'innerWidth', 'get').and.returnValue(
      1500
    );
  });

  beforeEach(inject(
    [ApplicationRef, SkyFlyoutService],
    (_applicationRef: ApplicationRef, _flyoutService: SkyFlyoutService) => {
      applicationRef = _applicationRef;
      flyoutService = _flyoutService;
      flyoutService.close();
    }
  ));

  afterEach(fakeAsync(() => {
    const modalService = TestBed.get(SkyModalService);
    modalService.dispose();
    flyoutService.close();
    applicationRef.tick();
    tick();
    fixture.detectChanges();
    flyoutService.ngOnDestroy();
    applicationRef.tick();
    fixture.destroy();
  }));

  it('should close when the close button is clicked', fakeAsync(() => {
    const flyout = openFlyout({});
    expect(flyout.isOpen).toBe(true);

    closeFlyout();
    expect(flyout.isOpen).toBe(false);
  }));

  it('should close when the click event fires outside of the flyout', fakeAsync(() => {
    const flyout = openFlyout({});
    expect(flyout.isOpen).toBe(true);

    SkyAppTestUtility.fireDomEvent(fixture.nativeElement, 'mouseup');
    fixture.nativeElement.click();
    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(false);
  }));

  it('should NOT close when the click event fires inside the flyout', fakeAsync(() => {
    const flyout = openFlyout({});
    expect(flyout.isOpen).toBe(true);

    const flyoutContentElement = getFlyoutElement();
    SkyAppTestUtility.fireDomEvent(flyoutContentElement, 'mouseup');
    flyoutContentElement.click();
    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(true);
  }));

  it('should NOT close when the click event fires on a modal element', fakeAsync(() => {
    const flyout = openHostFlyout();
    expect(flyout.isOpen).toBe(true);

    const flyoutModalTriggerElement = getFlyoutModalTriggerElement();
    SkyAppTestUtility.fireDomEvent(flyoutModalTriggerElement, 'mousedown');
    flyoutModalTriggerElement.click();
    fixture.detectChanges();
    tick();

    const modalContentElement = getModalElement();
    modalContentElement.click();
    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(true);

    closeModal();
    fixture.detectChanges();
    tick();
  }));

  it('should NOT close when the click event immediately deletes the target, within a modal', fakeAsync(() => {
    const flyout = fixture.componentInstance.openHostsFlyout();

    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(true);

    const flyoutModalTriggerElement = getFlyoutModalTriggerElement();
    SkyAppTestUtility.fireDomEvent(flyoutModalTriggerElement, 'mousedown');
    flyoutModalTriggerElement.click();

    fixture.detectChanges();
    tick();

    const deleteMeButton: HTMLButtonElement =
      getModalElement().querySelector('.delete-me-button');
    // Remove the button before triggering the click event.
    // Angular fires the click event before removing the element in unit tests.
    deleteMeButton.parentElement.removeChild(deleteMeButton);

    // Pass in the removed element as the target.
    const event = document.createEvent('CustomEvent');
    Object.defineProperty(event, 'target', {
      value: deleteMeButton,
    });
    event.initEvent('click', true, true);
    document.dispatchEvent(event);

    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(true);
    expect(getFlyoutElement()).not.toBeNull();

    closeModal();
    fixture.detectChanges();
    tick();
  }));

  it('should NOT close when the click event fires on a trigger for another flyout', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    openHostFlyout();
    expect(getFlyoutHostElement()).not.toBeNull();

    const flyoutTriggerElement = getFlyoutTriggerElement();
    SkyAppTestUtility.fireDomEvent(flyoutTriggerElement, 'mousedown');
    flyoutTriggerElement.click();

    fixture.detectChanges();
    tick();

    fixture.detectChanges();
    tick();

    expect(getFlyoutHostElement()).not.toBeNull();

    closeFlyout();
    fixture.detectChanges();
    tick();
  }));

  it('should NOT close when the click event fires on a toast element', fakeAsync(() => {
    const flyout = openHostFlyout();
    expect(flyout.isOpen).toBe(true);

    const flyoutToastTriggerElement = getFlyoutToastTriggerElement();
    SkyAppTestUtility.fireDomEvent(flyoutToastTriggerElement, 'mousedown');
    flyoutToastTriggerElement.click();
    fixture.detectChanges();
    tick();

    const toastContentElement = getToastElement();
    SkyAppTestUtility.fireDomEvent(toastContentElement, 'mousedown');
    toastContentElement.click();
    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(true);

    closeToast();
    fixture.detectChanges();
    tick();
  }));

  it('should NOT close when the click event fires while resizing', fakeAsync(() => {
    const flyout = openFlyout({});
    expect(flyout.isOpen).toBe(true);

    grabDragHandle(1000);
    dragHandle(1100);
    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(true);

    releaseDragHandle();
  }));

  it('should close when the Close message type is received', fakeAsync(() => {
    const flyout = openFlyout({});
    expect(flyout.isOpen).toBe(true);

    flyout.close();
    tick();
    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(false);
  }));

  it('should stop close event when beforeClose is subscribed to', fakeAsync(() => {
    let handlerFunction: Function;

    const flyout = openFlyout({});
    expect(flyout.isOpen).toBe(true);

    flyout.beforeClose.subscribe((handler) => {
      handlerFunction = handler.closeFlyout;
    });

    tick();
    fixture.detectChanges();
    tick();

    flyout.close();
    tick();
    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(true);

    closeFlyout();

    tick();
    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(true);

    handlerFunction();
    tick();
    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(false);
  }));

  it('should close the flyout anyway if ignoreBeforeClose is passed in', fakeAsync(() => {
    const flyout = openFlyout({});
    expect(flyout.isOpen).toBe(true);

    flyout.beforeClose.subscribe(() => {
      return;
    });

    tick();
    fixture.detectChanges();
    tick();

    flyout.close({ ignoreBeforeClose: true });
    tick();
    fixture.detectChanges();
    tick();

    expect(flyout.isOpen).toBe(false);
  }));

  it('should emit closed event of previously opened flyouts when a new one is opened', fakeAsync(() => {
    const flyout = openFlyout({});

    let closedCalled = false;
    flyout.closed.subscribe(() => {
      closedCalled = true;
    });

    // Open a new flyout before closing the last one:
    openFlyout({});

    expect(closedCalled).toEqual(true);
  }));

  it('should pass providers to the flyout', fakeAsync(() => {
    openFlyout({
      providers: [
        {
          provide: SkyFlyoutTestSampleContext,
          useValue: {
            name: 'Sally',
          },
        },
      ],
    });

    const flyoutContentElement = getFlyoutElement().querySelector(
      '.sky-flyout-content'
    ) as HTMLElement;

    expect(flyoutContentElement).toHaveText('Sally');
  }));

  it('should accept configuration options for aria-labelledBy, aria-describedby, role, and width', fakeAsync(() => {
    const expectedLabelledBy = 'customlabelledby';
    const expectedDescribed = 'customdescribedby';
    const expectedRole = 'customrole';
    const expectedDefault = 500;

    openFlyout({
      ariaLabelledBy: expectedLabelledBy,
      ariaDescribedBy: expectedDescribed,
      ariaRole: expectedRole,
      defaultWidth: expectedDefault,
    });

    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.getAttribute('aria-labelledby')).toBe(
      expectedLabelledBy
    );
    expect(flyoutElement.getAttribute('aria-describedby')).toBe(
      expectedDescribed
    );
    expect(flyoutElement.getAttribute('role')).toBe(expectedRole);
    expect(flyoutElement.style.width).toBe(expectedDefault + 'px');
  }));

  it('should accept configuration options for aria-label', fakeAsync(() => {
    const expectedLabel = 'customLabel';

    openFlyout({
      ariaLabel: expectedLabel,
    });

    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.getAttribute('aria-label')).toBe(expectedLabel);
  }));

  it('should have a default aria role when none is given', fakeAsync(() => {
    const expectedRole = 'dialog';

    openFlyout();

    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.getAttribute('role')).toBe(expectedRole);
  }));

  it('should set aria-modal on the flyout when the role is `dialog`', fakeAsync(() => {
    openFlyout({
      ariaRole: 'dialog',
    });

    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.getAttribute('aria-modal')).toBe('true');
  }));

  it('should not set aria-modal on the flyout when the role is not `dialog`', fakeAsync(() => {
    openFlyout({
      ariaRole: 'customRole',
    });

    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.getAttribute('aria-modal')).toBe('false');
  }));

  it('should set the flyout size to half the window size when no default width is given', fakeAsync(() => {
    openFlyout();

    const windowSize = window.innerWidth;

    const flyoutElement = getFlyoutElement();
    expect(flyoutElement.style.width).toBe(windowSize / 2 + 'px');
  }));

  it('should set the flyout size to the min width if the default width is less than the min', fakeAsync(() => {
    openFlyout({ minWidth: 400, defaultWidth: 200 });

    const flyoutElement = getFlyoutElement();
    expect(flyoutElement.style.width).toBe('400px');
  }));

  it('should set the flyout size to the max width if the default width is more than the max', fakeAsync(() => {
    openFlyout({ maxWidth: 400, defaultWidth: 800 });

    const flyoutElement = getFlyoutElement();
    expect(flyoutElement.style.width).toBe('400px');
  }));

  it('should set the flyout size to the value returned from the UI config service', fakeAsync(() => {
    spyOn(SkyUIConfigService.prototype, 'getConfig').and.returnValue(
      observableOf({ flyoutWidth: 557 })
    );

    openFlyout({ settingsKey: 'testKey', minWidth: 320, maxWidth: 1000 });

    fixture.detectChanges();
    tick();

    const flyoutElement = getFlyoutElement();
    expect(flyoutElement.style.width).toBe('557px');
  }));

  it('should set the flyout size to the min width if value returned from the UI config service is too small', fakeAsync(() => {
    spyOn(SkyUIConfigService.prototype, 'getConfig').and.returnValue(
      observableOf({ flyoutWidth: 200 })
    );

    openFlyout({ settingsKey: 'testKey', minWidth: 320, maxWidth: 1000 });

    fixture.detectChanges();
    tick();

    const flyoutElement = getFlyoutElement();
    expect(flyoutElement.style.width).toBe('320px');
  }));

  it('should set the flyout size to the max width if value returned from the UI config service is too big', fakeAsync(() => {
    spyOn(SkyUIConfigService.prototype, 'getConfig').and.returnValue(
      observableOf({ flyoutWidth: 1200 })
    );

    openFlyout({ settingsKey: 'testKey', minWidth: 320, maxWidth: 800 });

    fixture.detectChanges();
    tick();

    const flyoutElement = getFlyoutElement();
    expect(flyoutElement.style.width).toBe('800px');
  }));

  it('should set the flyout size to the default value when nothing is returned from the UI config service', fakeAsync(() => {
    spyOn(SkyUIConfigService.prototype, 'getConfig').and.returnValue(
      observableOf(undefined)
    );

    openFlyout({ defaultWidth: 590, settingsKey: 'testKey' });

    fixture.detectChanges();
    tick();

    const flyoutElement = getFlyoutElement();
    expect(flyoutElement.style.width).toBe('590px');
  }));

  it('should set the flyout size to the default value when a value without a flyout width is returned from the UI config service', fakeAsync(() => {
    spyOn(SkyUIConfigService.prototype, 'getConfig').and.returnValue(
      observableOf({ otherValue: 557 })
    );

    openFlyout({ defaultWidth: 590, settingsKey: 'testKey' });

    fixture.detectChanges();
    tick();

    const flyoutElement = getFlyoutElement();
    expect(flyoutElement.style.width).toBe('590px');
  }));

  it('should only load to 20px less than the window size', fakeAsync(() => {
    const windowSize = window.innerWidth;
    openFlyout({ maxWidth: 5000, minWidth: 0, defaultWidth: windowSize + 100 });
    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.style.width).toBe(window.innerWidth - 20 + 'px');
  }));

  it('should send the new sticky settings when load goes to 20px less than the window size', fakeAsync(() => {
    const windowSize = window.innerWidth;
    const uiSettingsSaveSpy = spyOn(
      SkyUIConfigService.prototype,
      'setConfig'
    ).and.callThrough();

    openFlyout({
      maxWidth: 5000,
      minWidth: 0,
      defaultWidth: windowSize + 100,
      settingsKey: 'testKey',
    });
    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.style.width).toBe(window.innerWidth - 20 + 'px');
    expect(uiSettingsSaveSpy).toHaveBeenCalledWith('testKey', {
      flyoutWidth: window.innerWidth - 20,
    });
  }));

  it('should not have the sky-flyout-help-shim class if the help widget is not present', fakeAsync(() => {
    openFlyout({});
    const headerElement = getFlyoutHeaderElement();
    expect(
      headerElement.classList.contains('sky-flyout-help-shim')
    ).toBeFalsy();
  }));

  it('should have the sky-flyout-help-shim class if the help widget is present', fakeAsync(() => {
    spyOn(window.document, 'getElementById').and.returnValue({} as HTMLElement);
    openFlyout({});
    const headerElement = getFlyoutHeaderElement();
    expect(
      headerElement.classList.contains('sky-flyout-help-shim')
    ).toBeTruthy();
  }));

  it('should automatically focus the close button when the flyout opens', fakeAsync(() => {
    (document.querySelector('#flyout-trigger-button') as HTMLElement).focus();

    openFlyout({}, { name: 'Sam', showNormalButton: true });

    tick();
    fixture.detectChanges();
    tick();

    expect(document.activeElement).toBe(
      document.querySelector('.sky-flyout-btn-close')
    );
  }));

  it('should automatically focus the an element with autofoucus in the content area when the flyout opens if one exists', fakeAsync(() => {
    (document.querySelector('#flyout-trigger-button') as HTMLElement).focus();

    const context: SkyFlyoutTestSampleContext = {
      name: 'Sam',
      showAutofocusButton: true,
      showNormalButton: true,
    };
    openFlyout({}, context);

    tick();
    fixture.detectChanges();
    tick();

    expect(document.activeElement).toBe(
      document.querySelector('#autofocus-button')
    );
  }));

  it('should resize when handle is dragged', fakeAsync(() => {
    openFlyout({ defaultWidth: 500 });
    fixture.detectChanges();
    tick();
    const moveSpy = spyOn(
      SkyFlyoutComponent.prototype,
      'onMouseMove'
    ).and.callThrough();
    const mouseUpSpy = spyOn(
      SkyFlyoutComponent.prototype,
      'onHandleRelease'
    ).and.callThrough();
    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.style.width).toBe('500px');

    resizeFlyout(1000, 1100);

    expect(flyoutElement.style.width).toBe('400px');

    resizeFlyout(1100, 1000);

    expect(moveSpy).toHaveBeenCalled();
    expect(mouseUpSpy).toHaveBeenCalled();
  }));

  it('should send the resized width to the UI config service when a settings key is given', fakeAsync(() => {
    openFlyout({ defaultWidth: 500, settingsKey: 'testKey' });
    fixture.detectChanges();
    tick();
    const uiSettingsSaveSpy = spyOn(
      SkyUIConfigService.prototype,
      'setConfig'
    ).and.callThrough();

    expect(uiSettingsSaveSpy).not.toHaveBeenCalled();

    resizeFlyout(1000, 1100);

    expect(uiSettingsSaveSpy).toHaveBeenCalledWith('testKey', {
      flyoutWidth: 400,
    });

    uiSettingsSaveSpy.calls.reset();

    resizeFlyout(1100, 1000);

    expect(uiSettingsSaveSpy).toHaveBeenCalledWith('testKey', {
      flyoutWidth: 500,
    });
  }));

  it('should not show the header resize grab handle when in default mode', fakeAsync(() => {
    openFlyout({ defaultWidth: 500 });
    fixture.detectChanges();
    tick();

    const grabHandle = getFlyoutHeaderGrabHandle();

    expect(grabHandle).toBeNull();
  }));

  it('should handle errors when setting config', fakeAsync(() => {
    const warnSpy = spyOn(console, 'warn');

    openFlyout({ defaultWidth: 500, settingsKey: 'testKey' });
    fixture.detectChanges();
    tick();

    /* tslint:disable:deprecation */
    /**
     * NOTE: We need to update this to use the new throwError Observable creation function
     */
    spyOn(SkyUIConfigService.prototype, 'setConfig').and.returnValue(
      observableThrow({ message: 'Test error' })
    );
    /* tslint:enable:deprecation */

    resizeFlyout(1000, 1100);

    expect(warnSpy).toHaveBeenCalledWith('Could not save flyout data.');
    expect(warnSpy).toHaveBeenCalledWith({
      message: 'Test error',
    });
  }));

  it('should not resize on mousemove unless the resize handle was clicked', fakeAsync(() => {
    openFlyout({ defaultWidth: 500 });
    fixture.detectChanges();
    tick();
    const moveSpy = spyOn(
      SkyFlyoutComponent.prototype,
      'onMouseMove'
    ).and.callThrough();
    const mouseUpSpy = spyOn(
      SkyFlyoutComponent.prototype,
      'onHandleRelease'
    ).and.callThrough();
    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.style.width).toBe('500px');

    dragHandle(1100);

    expect(flyoutElement.style.width).toBe('500px');

    dragHandle(1000);

    expect(flyoutElement.style.width).toBe('500px');

    releaseDragHandle();

    expect(moveSpy).not.toHaveBeenCalled();
    expect(mouseUpSpy).not.toHaveBeenCalled();
  }));

  it('should have correct aria-labels on resizing range input', fakeAsync(() => {
    openFlyout({ maxWidth: 1000, minWidth: 200, defaultWidth: 500 });
    const flyoutElement = getFlyoutElement();
    const resizeInput: any = flyoutElement.querySelector(
      '.sky-flyout-resize-handle'
    );

    expect(flyoutElement.style.width).toBe('500px');
    expect(resizeInput.getAttribute('aria-controls')).toBe(flyoutElement.id);

    expect(resizeInput.getAttribute('aria-valuenow')).toBe('500');
    expect(resizeInput.getAttribute('aria-valuemax')).toBe('1000');
    expect(resizeInput.getAttribute('aria-valuemin')).toBe('200');
  }));

  it('should set iframe styles correctly during dragging', fakeAsync(() => {
    openFlyout({}, { name: 'Sam', showIframe: true });
    const iframe = getIframe();

    expect(iframe.style.pointerEvents).toBeFalsy();

    grabDragHandle(1000);

    expect(iframe.style.pointerEvents).toBe('none');

    dragHandle(500);

    expect(iframe.style.pointerEvents).toBe('none');

    releaseDragHandle();

    expect(iframe.style.pointerEvents).toBeFalsy();
  }));

  it('should respect minimum and maximum when resizing', fakeAsync(() => {
    openFlyout({ maxWidth: 600, minWidth: 400, defaultWidth: 500 });
    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.style.width).toBe('500px');

    resizeFlyout(1000, 900);

    expect(flyoutElement.style.width).toBe('600px');

    resizeFlyout(900, 899);

    expect(flyoutElement.style.width).toBe('600px');

    resizeFlyout(900, 1100);

    expect(flyoutElement.style.width).toBe('400px');

    resizeFlyout(1100, 1101);

    expect(flyoutElement.style.width).toBe('400px');
  }));

  it('should only resize to 20px less than the window size', fakeAsync(() => {
    openFlyout({ maxWidth: 5000, minWidth: 0, defaultWidth: 500 });
    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.style.width).toBe('500px');

    // This calculation is weird but is to ensure this test works on different screen sizes
    resizeFlyout(1000, 1500 - window.innerWidth);

    expect(flyoutElement.style.width).toBe(window.innerWidth - 20 + 'px');
  }));

  it('should not resize when handle is not clicked', fakeAsync(() => {
    openFlyout({ defaultWidth: 500 });
    const flyoutElement = getFlyoutElement();

    expect(flyoutElement.style.width).toBe('500px');
    makeEvent('mousemove', { clientX: 1100 });
    fixture.detectChanges();
    expect(flyoutElement.style.width).toBe('500px');
  }));

  it('should allow click events to bubble up to the document to support 3rd-party event listeners', fakeAsync(() => {
    openFlyout({ maxWidth: 1000, minWidth: 200 });
    const flyout = document.querySelector('.sky-flyout');

    let numDocumentClicks = 0;
    document.addEventListener('click', () => {
      numDocumentClicks++;
    });

    fixture.detectChanges();
    tick();

    let numFlyoutClicks = 0;
    flyout.addEventListener('click', () => {
      numFlyoutClicks++;
    });

    fixture.detectChanges();
    tick();

    SkyAppTestUtility.fireDomEvent(flyout, 'click');

    fixture.detectChanges();
    tick();

    expect(numFlyoutClicks).toEqual(1);
    expect(numDocumentClicks).toEqual(1);
  }));

  describe('permalink', () => {
    it('should not show the permalink button if no permalink config peroperties are defined', fakeAsync(() => {
      openFlyout({});
      const permaLinkButton = getPermalinkButtonElement();
      expect(permaLinkButton).toBeFalsy();
    }));

    it('should use the default permalink label if none is defined', fakeAsync(() => {
      const expectedPermalink = 'http://bb.com';
      const expectedLabel = 'View record';

      openFlyout({
        permalink: {
          url: expectedPermalink,
        },
      });

      const permaLinkButton = getPermalinkButtonElement();
      expect(permaLinkButton).toBeTruthy();
      expect(permaLinkButton.innerHTML.trim()).toEqual(expectedLabel);
    }));

    it('should use the custom defined label for permalink', fakeAsync(() => {
      const expectedPermalink = 'http://bb.com';
      const expectedLabel = 'Foo Bar';

      openFlyout({
        permalink: {
          label: expectedLabel,
          url: expectedPermalink,
        },
      });

      const permaLinkButton = getPermalinkButtonElement();
      expect(permaLinkButton).toBeTruthy();
      expect(permaLinkButton.innerHTML.trim()).toEqual(expectedLabel);
    }));

    it('should open the defined permalink URL when clicking on the permalink button', fakeAsync(() => {
      const expectedPermalink = 'http://bb.com';
      openFlyout({
        permalink: {
          url: expectedPermalink,
        },
      });
      const permaLinkButton = getPermalinkButtonElement();
      expect(permaLinkButton.getAttribute('href')).toEqual(expectedPermalink);
    }));

    it('should navigate to a route when clicking on the permalink button', fakeAsync(() => {
      openFlyout({
        permalink: {
          route: {
            commands: ['/'],
            extras: {
              fragment: 'fooFragment',
              queryParams: {
                envid: 'fooId',
              },
            },
          },
        },
      });
      const permalinkButton = getPermalinkButtonElement();
      expect(permalinkButton.getAttribute('href')).toEqual(
        '/?envid=fooId#fooFragment'
      );
    }));

    it('should include defined state data when navigating', fakeAsync(() => {
      openFlyout({
        permalink: {
          route: {
            commands: ['/'],
            extras: {
              fragment: 'fooFragment',
              queryParams: {
                envid: 'fooId',
              },
              state: {
                foo: 'bar',
              },
            },
          },
        },
      });
      getPermalinkButtonElement().click();
      const navigation = TestBed.inject(Router).getCurrentNavigation();
      expect(navigation.extras.state.foo).toEqual('bar');
      tick();
    }));

    it('should navigate to a URL when clicking on the permalink button', fakeAsync(() => {
      openFlyout({
        permalink: {
          url: 'http://foo.com',
        },
      });
      const permalinkButton = getPermalinkButtonElement();
      expect(permalinkButton.getAttribute('href')).toEqual('http://foo.com');
    }));
  });

  describe('primary action', () => {
    it('should not show the primary action button if no action is configured', fakeAsync(() => {
      openFlyout({});
      const primaryActionButton = getPrimaryActionButtonElement();
      expect(primaryActionButton).toBeFalsy();
    }));

    it('should use the default primary action label if none is defined', fakeAsync(() => {
      const expectedLabel = 'Create list';

      openFlyout({
        primaryAction: {
          callback: () => {},
        },
      });

      const primaryActionButton = getPrimaryActionButtonElement();
      expect(primaryActionButton).toBeTruthy();
      expect(primaryActionButton.innerHTML.trim()).toEqual(expectedLabel);
    }));

    it('should use the custom defined label for primary action', fakeAsync(() => {
      const expectedLabel = 'Create list';

      openFlyout({
        primaryAction: {
          callback: () => {},
          label: expectedLabel,
        },
      });

      const primaryActionButton = getPrimaryActionButtonElement();
      expect(primaryActionButton).toBeTruthy();
      expect(primaryActionButton.innerHTML.trim()).toEqual(expectedLabel);
    }));

    it('should invoke the primary action callback when clicking on the primary action button', fakeAsync(() => {
      let primaryActionInvoked = false;

      openFlyout({
        primaryAction: {
          callback: () => {
            primaryActionInvoked = true;
          },
        },
      });

      const primaryActionButton = getPrimaryActionButtonElement();
      expect(primaryActionButton).toBeTruthy();
      primaryActionButton.click();

      // let the close message propagate
      applicationRef.tick();
      tick();

      expect(primaryActionInvoked).toBe(true);
    }));

    it('should close the flyout after invoking the primary action if configured to do so', fakeAsync(() => {
      const flyoutInstance = openFlyout({
        primaryAction: {
          callback: () => {},
          closeAfterInvoking: true,
        },
      });

      const primaryActionButton = getPrimaryActionButtonElement();
      expect(primaryActionButton).toBeTruthy();
      primaryActionButton.click();

      // let the close message propagate
      applicationRef.tick();
      tick();

      expect(flyoutInstance.isOpen).toBeFalsy();
    }));

    it('should not close the flyout after invoking the primary action if not configured to do so', fakeAsync(() => {
      const flyoutInstance = openFlyout({
        primaryAction: {
          callback: () => {},
          closeAfterInvoking: false,
        },
      });

      const primaryActionButton = getPrimaryActionButtonElement();
      expect(primaryActionButton).toBeTruthy();
      primaryActionButton.click();

      // let the close message propagate
      applicationRef.tick();
      tick();

      expect(flyoutInstance.isOpen).toBeTruthy();
    }));

    it('should not close the flyout after invoking the primary action if configuration is not set', fakeAsync(() => {
      const flyoutInstance = openFlyout({
        primaryAction: {
          callback: () => {},
        },
      });

      const primaryActionButton = getPrimaryActionButtonElement();
      expect(primaryActionButton).toBeTruthy();
      primaryActionButton.click();

      // let the close message propagate
      applicationRef.tick();
      tick();

      expect(flyoutInstance.isOpen).toBeTruthy();
    }));
  });

  describe('iterator', () => {
    function getIteratorButtons(): NodeListOf<HTMLButtonElement> {
      return document.querySelectorAll(
        '#iterators button'
      ) as NodeListOf<HTMLButtonElement>;
    }

    it('should not show iterator buttons if config.showIterator is undefined', fakeAsync(() => {
      openFlyout({});
      const iteratorButtons = getIteratorButtons();
      expect(iteratorButtons.length).toEqual(0);
    }));

    it('should not show iterator buttons if config.showIterator is false', fakeAsync(() => {
      openFlyout({
        showIterator: false,
      });
      const iteratorButtons = getIteratorButtons();
      expect(iteratorButtons.length).toEqual(0);
    }));

    it('should show iterator buttons if config.showIterator is true', fakeAsync(() => {
      openFlyout({
        showIterator: true,
      });
      const iteratorButtons = getIteratorButtons();
      expect(iteratorButtons.length).toEqual(2);
      expect(iteratorButtons[0].disabled).toBeFalsy();
      expect(iteratorButtons[1].disabled).toBeFalsy();
    }));

    it('should disable iterator buttons if config disabled properties are true', fakeAsync(() => {
      openFlyout({
        showIterator: true,
        iteratorPreviousButtonDisabled: true,
        iteratorNextButtonDisabled: true,
      });
      const iteratorButtons = getIteratorButtons();
      expect(iteratorButtons.length).toEqual(2);
      expect(iteratorButtons[0].disabled).toBeTruthy();
      expect(iteratorButtons[1].disabled).toBeTruthy();
    }));

    it('should enable iterator buttons if disabled properties are false', fakeAsync(() => {
      openFlyout({
        showIterator: true,
        iteratorPreviousButtonDisabled: false,
        iteratorNextButtonDisabled: false,
      });
      const iteratorButtons = getIteratorButtons();
      expect(iteratorButtons.length).toEqual(2);
      expect(iteratorButtons[0].disabled).toBeFalsy();
      expect(iteratorButtons[1].disabled).toBeFalsy();
    }));

    it('should emit if previous button is clicked', fakeAsync(() => {
      let previousCalled = false;
      let nextCalled = false;

      const flyoutInstance = openFlyout({
        showIterator: true,
      });

      flyoutInstance.iteratorPreviousButtonClick.subscribe(() => {
        previousCalled = true;
      });

      flyoutInstance.iteratorNextButtonClick.subscribe(() => {
        nextCalled = true;
      });

      const iteratorButtons = getIteratorButtons();
      iteratorButtons[0].click();
      fixture.detectChanges();
      tick();
      expect(previousCalled).toEqual(true);
      expect(nextCalled).toEqual(false);
    }));

    it('should emit if next button is clicked', fakeAsync(() => {
      let previousCalled = false;
      let nextCalled = false;

      const flyoutInstance = openFlyout({
        showIterator: true,
      });

      flyoutInstance.iteratorPreviousButtonClick.subscribe(() => {
        previousCalled = true;
      });

      flyoutInstance.iteratorNextButtonClick.subscribe(() => {
        nextCalled = true;
      });

      const iteratorButtons = getIteratorButtons();
      iteratorButtons[1].click();
      fixture.detectChanges();
      tick();
      expect(previousCalled).toEqual(false);
      expect(nextCalled).toEqual(true);
    }));

    it('should not emit if iterator buttons are clicked when config properties are disabled', fakeAsync(() => {
      let previousCalled = false;
      let nextCalled = false;

      const flyoutInstance = openFlyout({
        showIterator: true,
        iteratorPreviousButtonDisabled: true,
        iteratorNextButtonDisabled: true,
      });

      flyoutInstance.iteratorPreviousButtonClick.subscribe(() => {
        previousCalled = true;
      });

      flyoutInstance.iteratorNextButtonClick.subscribe(() => {
        nextCalled = true;
      });

      const iteratorButtons = getIteratorButtons();
      iteratorButtons[0].click();
      iteratorButtons[1].click();
      fixture.detectChanges();
      tick();
      expect(previousCalled).toEqual(false);
      expect(nextCalled).toEqual(false);
    }));

    it('should allow consumer to enable/disable buttons after flyout is opened', fakeAsync(() => {
      const flyout = openFlyout({
        showIterator: true,
      });
      const iteratorButtons = getIteratorButtons();

      // Expect flyout to have iterator buttons, both enabled.
      expect(iteratorButtons.length).toEqual(2);
      expect(iteratorButtons[0].disabled).toBeFalsy();
      expect(iteratorButtons[1].disabled).toBeFalsy();
      expect(flyout.iteratorNextButtonDisabled).toEqual(false);
      expect(flyout.iteratorPreviousButtonDisabled).toEqual(false);

      flyout.iteratorPreviousButtonDisabled = true;
      flyout.iteratorNextButtonDisabled = true;
      fixture.detectChanges();

      // Expect flyout to have iterator buttons, both disabled.
      expect(iteratorButtons.length).toEqual(2);
      expect(iteratorButtons[0].disabled).toBeTruthy();
      expect(iteratorButtons[1].disabled).toBeTruthy();
      expect(flyout.iteratorNextButtonDisabled).toEqual(true);
      expect(flyout.iteratorPreviousButtonDisabled).toEqual(true);

      flyout.iteratorPreviousButtonDisabled = false;
      flyout.iteratorNextButtonDisabled = false;
      fixture.detectChanges();

      // Expect flyout to have iterator buttons, both enabled.
      expect(iteratorButtons.length).toEqual(2);
      expect(iteratorButtons[0].disabled).toBeFalsy();
      expect(iteratorButtons[1].disabled).toBeFalsy();
      expect(flyout.iteratorNextButtonDisabled).toEqual(false);
      expect(flyout.iteratorPreviousButtonDisabled).toEqual(false);
    }));

    it('should remove host if a non-close message stream event was fired before close - added due to bug', fakeAsync(() => {
      const flyout = openFlyout({
        showIterator: true,
      });

      flyout.iteratorPreviousButtonDisabled = true;
      flyout.iteratorNextButtonDisabled = true;
      fixture.detectChanges();

      const iteratorButtons = getIteratorButtons();
      expect(iteratorButtons.length).toEqual(2);
      expect(iteratorButtons[0].disabled).toBeTruthy();
      expect(iteratorButtons[1].disabled).toBeTruthy();

      closeFlyout();

      expect(getFlyoutHostElement()).toBeNull();
    }));
  });

  describe('responsive states', () => {
    it('should not have the fullscreen class normally', fakeAsync(() => {
      openFlyout({ defaultWidth: 500, minWidth: 400 });
      const flyoutElement = getFlyoutElement();
      expect(
        flyoutElement.classList.contains('sky-flyout-fullscreen')
      ).toBeFalsy();
    }));

    it('should have the fullscreen class appropriately on resize', fakeAsync(() => {
      openFlyout({ defaultWidth: 500, minWidth: 400 });

      let flyoutElement = getFlyoutElement();
      expect(
        flyoutElement.classList.contains('sky-flyout-fullscreen')
      ).toBeFalsy();

      windowSizeSpy.and.returnValue(400);

      SkyAppTestUtility.fireDomEvent(window, 'resize');

      fixture.detectChanges();

      flyoutElement = getFlyoutElement();

      expect(
        flyoutElement.classList.contains('sky-flyout-fullscreen')
      ).toBeTruthy();
    }));

    it('should not resize when handle is dragged and fullscreen is active', fakeAsync(() => {
      openFlyout({ defaultWidth: 500, minWidth: 400 });
      fixture.detectChanges();
      tick();
      const moveSpy = spyOn(
        SkyFlyoutComponent.prototype,
        'onMouseMove'
      ).and.callThrough();
      const mouseUpSpy = spyOn(
        SkyFlyoutComponent.prototype,
        'onHandleRelease'
      ).and.callThrough();
      const flyoutElement = getFlyoutElement();

      expect(flyoutElement.style.width).toBe('500px');

      resizeFlyout(1000, 1100);

      expect(flyoutElement.style.width).toBe('400px');

      windowSizeSpy.and.returnValue(400);

      SkyAppTestUtility.fireDomEvent(window, 'resize');

      fixture.detectChanges();

      resizeFlyout(1100, 1000);

      expect(moveSpy).toHaveBeenCalledTimes(1);
      expect(mouseUpSpy).toHaveBeenCalledTimes(1);
    }));

    it('should have the fullscreen class appropriately on load', fakeAsync(() => {
      windowSizeSpy.and.returnValue(400);
      openFlyout({ defaultWidth: 500, minWidth: 400 });
      const flyoutElement = getFlyoutElement();
      expect(
        flyoutElement.classList.contains('sky-flyout-fullscreen')
      ).toBeTruthy();
    }));

    it('should call the host listener correctly on resize', fakeAsync(() => {
      const resizeSpy = spyOn(
        SkyFlyoutComponent.prototype,
        'onWindowResize'
      ).and.callThrough();
      windowSizeSpy.and.callThrough();

      openFlyout({});

      expect(resizeSpy).not.toHaveBeenCalled();

      SkyAppTestUtility.fireDomEvent(window, 'resize');

      expect(resizeSpy).toHaveBeenCalled();
    }));

    it('should resize 20px less than the window size when needed', fakeAsync(() => {
      windowSizeSpy.and.returnValue(1500);
      openFlyout({ maxWidth: 5000, minWidth: 0, defaultWidth: 1600 });
      const flyoutElement = getFlyoutElement();

      expect(flyoutElement.style.width).toBe('1480px');

      windowSizeSpy.and.returnValue(1400);

      SkyAppTestUtility.fireDomEvent(window, 'resize');

      fixture.detectChanges();

      expect(flyoutElement.style.width).toBe('1380px');
    }));

    it('should send the new sticky settings when resize caused flyout to resize to 20px less than the window size', fakeAsync(() => {
      windowSizeSpy.and.returnValue(1500);
      const uiSettingsSaveSpy = spyOn(
        SkyUIConfigService.prototype,
        'setConfig'
      ).and.callThrough();

      openFlyout({
        maxWidth: 5000,
        minWidth: 0,
        defaultWidth: 800,
        settingsKey: 'testKey',
      });
      const flyoutElement = getFlyoutElement();

      expect(flyoutElement.style.width).toBe('800px');
      expect(uiSettingsSaveSpy).not.toHaveBeenCalled();

      windowSizeSpy.and.returnValue(600);

      SkyAppTestUtility.fireDomEvent(window, 'resize');

      fixture.detectChanges();

      expect(flyoutElement.style.width).toBe('580px');
      expect(uiSettingsSaveSpy).toHaveBeenCalledWith('testKey', {
        flyoutWidth: 580,
      });
    }));
  });

  describe('responsive states', () => {
    it('should set the media query service breakpoint to the window size when xs via resize', fakeAsync(() => {
      const breakpointSpy = spyOn(
        SkyFlyoutMediaQueryService.prototype,
        'setBreakpointForWidth'
      ).and.callThrough();
      windowSizeSpy.and.callThrough();

      openFlyout({ defaultWidth: 500 });

      windowSizeSpy.and.returnValue(767);

      SkyAppTestUtility.fireDomEvent(window, 'resize');

      expect(breakpointSpy).toHaveBeenCalledWith(767);
    }));

    it(`should set the media query service breakpoint to the flyout size when larger
  than xs via resize`, fakeAsync(() => {
      const breakpointSpy = spyOn(
        SkyFlyoutMediaQueryService.prototype,
        'setBreakpointForWidth'
      ).and.callThrough();

      openFlyout({ defaultWidth: 500 });

      windowSizeSpy.and.returnValue(800);

      SkyAppTestUtility.fireDomEvent(window, 'resize');

      expect(breakpointSpy).toHaveBeenCalledWith(500);

      windowSizeSpy.and.returnValue(1000);

      SkyAppTestUtility.fireDomEvent(window, 'resize');

      expect(breakpointSpy).toHaveBeenCalledWith(500);

      windowSizeSpy.and.returnValue(1400);

      SkyAppTestUtility.fireDomEvent(window, 'resize');

      expect(breakpointSpy).toHaveBeenCalledWith(500);
    }));

    it('should set the media query service breakpoint to the window size when xs via resize', fakeAsync(() => {
      const breakpointSpy = spyOn(
        SkyFlyoutMediaQueryService.prototype,
        'setBreakpointForWidth'
      ).and.callThrough();
      windowSizeSpy.and.returnValue(767);

      openFlyout({ defaultWidth: 500 });

      expect(breakpointSpy).toHaveBeenCalledWith(767);
    }));

    it(`should set the media query service breakpoint to the flyout size when larger
    than xs on load`, fakeAsync(() => {
      const breakpointSpy = spyOn(
        SkyFlyoutMediaQueryService.prototype,
        'setBreakpointForWidth'
      ).and.callThrough();
      windowSizeSpy.and.returnValue(800);

      openFlyout({ defaultWidth: 500 });

      expect(breakpointSpy).toHaveBeenCalledWith(500);
    }));

    it('should add the xs class when appropriate', fakeAsync(() => {
      // Spy on window size to bypass the flyout not resizing past the browser size
      windowSizeSpy.and.returnValue(5000);
      openFlyout({ maxWidth: 10000, minWidth: 50, defaultWidth: 500 });
      fixture.detectChanges();
      tick();
      const flyoutHostElement = getFlyoutHostElement();
      const flyoutElement = getFlyoutElement();

      resizeFlyout(1000, 1100);

      expect(flyoutElement.style.width).toBe('400px');
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-xs')
      ).toBeTruthy();
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-sm')
      ).toBeFalsy();
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-md')
      ).toBeFalsy();
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-lg')
      ).toBeFalsy();
    }));

    it('should add the xs class when appropriate due to xs screen size', fakeAsync(() => {
      // Spy on window size to bypass the flyout not resizing past the browser size
      windowSizeSpy.and.returnValue(5000);
      openFlyout({ maxWidth: 10000, minWidth: 50, defaultWidth: 500 });
      fixture.detectChanges();
      tick();
      const flyoutHostElement = getFlyoutHostElement();

      resizeFlyout(1000, 600);

      windowSizeSpy.and.returnValue(767);

      SkyAppTestUtility.fireDomEvent(window, 'resize');

      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-xs')
      ).toBeTruthy();
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-sm')
      ).toBeFalsy();
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-md')
      ).toBeFalsy();
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-lg')
      ).toBeFalsy();
    }));

    it('should add the sm class when appropriate', fakeAsync(() => {
      // Spy on window size to bypass the flyout not resizing past the browser size
      windowSizeSpy.and.returnValue(5000);
      openFlyout({ maxWidth: 10000, minWidth: 50, defaultWidth: 500 });
      fixture.detectChanges();
      tick();
      const flyoutHostElement = getFlyoutHostElement();
      const flyoutElement = getFlyoutElement();

      resizeFlyout(1000, 600);

      expect(flyoutElement.style.width).toBe('900px');
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-sm')
      ).toBeTruthy();
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-xs')
      ).toBeFalsy();
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-md')
      ).toBeFalsy();
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-lg')
      ).toBeFalsy();
    }));

    it('should add the md class when appropriate', fakeAsync(() => {
      // Spy on window size to bypass the flyout not resizing past the browser size
      windowSizeSpy.and.returnValue(5000);
      openFlyout({ maxWidth: 10000, minWidth: 50, defaultWidth: 500 });
      fixture.detectChanges();
      tick();
      const flyoutHostElement = getFlyoutHostElement();
      const flyoutElement = getFlyoutElement();

      resizeFlyout(1000, 400);

      expect(flyoutElement.style.width).toBe('1100px');
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-md')
      ).toBeTruthy();
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-xs')
      ).toBeFalsy();
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-sm')
      ).toBeFalsy();
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-lg')
      ).toBeFalsy();
    }));

    it('should add the lg class when appropriate', fakeAsync(() => {
      // Spy on window size to bypass the flyout not resizing past the browser size
      windowSizeSpy.and.returnValue(5000);
      openFlyout({ maxWidth: 10000, minWidth: 50, defaultWidth: 500 });
      fixture.detectChanges();
      tick();
      const flyoutHostElement = getFlyoutHostElement();
      const flyoutElement = getFlyoutElement();

      resizeFlyout(1000, 100);

      expect(flyoutElement.style.width).toBe('1400px');
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-lg')
      ).toBeTruthy();
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-xs')
      ).toBeFalsy();
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-sm')
      ).toBeFalsy();
      expect(
        flyoutHostElement.classList.contains('sky-responsive-container-md')
      ).toBeFalsy();
    }));

    describe('when in modern theme', () => {
      beforeEach(() => {
        mockThemeSvc.settingsChange.next({
          currentSettings: new SkyThemeSettings(
            SkyTheme.presets.modern,
            SkyThemeMode.presets.light
          ),
          previousSettings:
            mockThemeSvc.settingsChange.getValue().currentSettings,
        });
      });

      it('should show the header resize grab handle when in modern theme', fakeAsync(() => {
        openFlyout({ defaultWidth: 500 });
        fixture.detectChanges();
        tick();

        const grabHandle = getFlyoutHeaderGrabHandle();

        expect(grabHandle).not.toBeNull();
      }));

      it('should resize when header grab handle is dragged', fakeAsync(() => {
        openFlyout({ defaultWidth: 500 });
        fixture.detectChanges();
        tick();
        const moveSpy = spyOn(
          SkyFlyoutComponent.prototype,
          'onMouseMove'
        ).and.callThrough();
        const mouseUpSpy = spyOn(
          SkyFlyoutComponent.prototype,
          'onHandleRelease'
        ).and.callThrough();
        const flyoutElement = getFlyoutElement();

        expect(flyoutElement.style.width).toBe('500px');

        resizeFlyoutWithHeaderGrabHandle(1000, 1100);

        expect(flyoutElement.style.width).toBe('400px');

        resizeFlyout(1100, 1000);

        expect(moveSpy).toHaveBeenCalled();
        expect(mouseUpSpy).toHaveBeenCalled();
      }));

      it('should not resize when arrow keys are pressed on the resize handle without pressing enter first', fakeAsync(() => {
        openFlyout({ defaultWidth: 500, maxWidth: 600 });
        fixture.detectChanges();
        tick();
        const flyoutElement = getFlyoutElement();

        fireKeyDownOnSeparatorHandle('arrowLeft');

        expect(flyoutElement.style.width).toBe('500px');

        fireKeyDownOnSeparatorHandle('arrowRight');

        expect(flyoutElement.style.width).toBe('500px');
      }));

      it('should resize when arrow keys are pressed on the resize handle only after pressing enter first', fakeAsync(() => {
        openFlyout({ defaultWidth: 500, maxWidth: 600 });
        fixture.detectChanges();
        tick();
        const flyoutElement = getFlyoutElement();

        fireKeyDownOnSeparatorHandle('enter');
        fireKeyDownOnSeparatorHandle('arrowLeft');

        expect(flyoutElement.style.width).toBe('510px');

        fireKeyDownOnSeparatorHandle('arrowRight');

        expect(flyoutElement.style.width).toBe('500px');
      }));

      it('should deactivate resizing when tab key is pressed', fakeAsync(() => {
        openFlyout({ defaultWidth: 500, maxWidth: 600 });
        fixture.detectChanges();
        tick();
        const flyoutElement = getFlyoutElement();

        fireKeyDownOnSeparatorHandle('enter');
        fireKeyDownOnSeparatorHandle('arrowLeft');

        expect(flyoutElement.style.width).toBe('510px');

        fireKeyDownOnSeparatorHandle('tab');
        fireKeyDownOnSeparatorHandle('arrowRight');

        // Size should not have changed, because user tabbed away from the handle.
        expect(flyoutElement.style.width).toBe('510px');
      }));

      it('should not resize when arrow keys are pressed on the header grab handle without pressing enter first', fakeAsync(() => {
        openFlyout({ defaultWidth: 500, maxWidth: 600 });
        fixture.detectChanges();
        tick();
        const flyoutElement = getFlyoutElement();

        fireKeyDownOnHeaderGrabHandle('arrowLeft');

        expect(flyoutElement.style.width).toBe('500px');

        fireKeyDownOnHeaderGrabHandle('arrowRight');

        expect(flyoutElement.style.width).toBe('500px');
      }));

      it('should resize when arrow keys are pressed on the header grab handle only after enter is pressed first to activate', fakeAsync(() => {
        openFlyout({ defaultWidth: 500, maxWidth: 600 });
        fixture.detectChanges();
        tick();
        const flyoutElement = getFlyoutElement();

        fireKeyDownOnHeaderGrabHandle('enter');
        fireKeyDownOnHeaderGrabHandle('arrowLeft');

        expect(flyoutElement.style.width).toBe('510px');

        fireKeyDownOnHeaderGrabHandle('arrowRight');

        expect(flyoutElement.style.width).toBe('500px');
      }));

      it('should prevent width from going over the max when left arrow key is pressed on the header grab handle', fakeAsync(() => {
        openFlyout({ defaultWidth: 490, maxWidth: 505 });
        fixture.detectChanges();
        tick();
        const flyoutElement = getFlyoutElement();

        fireKeyDownOnHeaderGrabHandle('enter');
        fireKeyDownOnHeaderGrabHandle('arrowLeft');
        fireKeyDownOnHeaderGrabHandle('arrowLeft');

        expect(flyoutElement.style.width).toBe('505px');
      }));

      it('should prevent width from going under the min when right arrow key is pressed on the header grab handle', fakeAsync(() => {
        openFlyout({ defaultWidth: 510, minWidth: 495 });
        fixture.detectChanges();
        tick();
        const flyoutElement = getFlyoutElement();

        fireKeyDownOnHeaderGrabHandle('enter');
        fireKeyDownOnHeaderGrabHandle('arrowRight');
        fireKeyDownOnHeaderGrabHandle('arrowRight');

        expect(flyoutElement.style.width).toBe('495px');
      }));
    });
  });
});
