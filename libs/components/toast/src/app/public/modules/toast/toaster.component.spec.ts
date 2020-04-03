import {
  ApplicationRef
} from '@angular/core';

import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyToastFixturesModule,
  SkyToasterTestComponent,
  SkyToastBodyTestComponent,
  SkyToastBodyTestContext
} from './fixtures';

import {
  SkyToastInstance
} from './toast-instance';

import {
  SkyToastService
} from './toast.service';

import {
  SkyToasterComponent
} from './toaster.component';

import {
  SkyToasterService
} from './toaster.service';

import {
  SkyToastContainerOptions
} from './types/toast-container-options';

import {
  SkyToastDisplayDirection
} from './types/toast-display-direction';

describe('Toast component', () => {
  let fixture: ComponentFixture<SkyToasterTestComponent>;
  let toastService: SkyToastService;
  let toasterService: SkyToasterService;
  let applicationRef: ApplicationRef;
  let options: SkyToastContainerOptions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyToastFixturesModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: SkyToastContainerOptions,
          useValue: {
            displayDirection: SkyToastDisplayDirection.OldestOnTop
          } as SkyToastContainerOptions
        }
      ]
    });

    toasterService = new SkyToasterService();

    fixture = TestBed
      .overrideComponent(
        SkyToasterComponent,
        {
          add: {
            providers: [
              {
                provide: SkyToasterService,
                useValue: toasterService
              }
            ]
          }
        }
      )
      .createComponent(SkyToasterTestComponent);
  });

  beforeEach(inject(
    [ApplicationRef, SkyToastService, SkyToastContainerOptions],
    (
      _applicationRef: ApplicationRef,
      _toastService: SkyToastService,
      _options: SkyToastContainerOptions
    ) => {
      applicationRef = _applicationRef;
      toastService = _toastService;
      options = _options;
    }
  ));

  afterEach(fakeAsync(() => {
    toastService.ngOnDestroy();
    applicationRef.tick();
    tick();
    fixture.detectChanges();
    fixture.destroy();
  }));

  function getToastElements(): NodeListOf<any> {
    return document.querySelectorAll('sky-toast');
  }

  function openMessage(message = ''): SkyToastInstance {
    const instance = toastService.openMessage(message);
    fixture.detectChanges();
    tick();
    return instance;
  }

  function openComponent(message = ''): SkyToastInstance {
    const providers = [{
      provide: SkyToastBodyTestContext,
      useValue: new SkyToastBodyTestContext(message)
    }];
    const instance = toastService.openComponent(
      SkyToastBodyTestComponent,
      {},
      providers
    );
    fixture.detectChanges();
    tick();
    return instance;
  }

  function validateToastMessage(toastEl: any, message: string): void {
    expect(toastEl.querySelector('.sky-toast-content')).toHaveText(message, true);
  }

  it('should not create a toaster element if one exists', fakeAsync(() => {
    openMessage();

    let toasters = document.querySelectorAll('sky-toaster');
    expect(toasters.length).toEqual(1);

    openMessage();
    toasters = document.querySelectorAll('sky-toaster');
    expect(toasters.length).toEqual(1);

    const toasts = getToastElements();
    expect(toasts.length).toEqual(2);
  }));

  it('should display a toast component with defaults', fakeAsync(() => {
    const message = 'Hello, World!';
    openMessage(message);

    const toasts = getToastElements();
    expect(toasts.length).toEqual(1);
    validateToastMessage(toasts[0], message);
    expect(toasts.item(0).querySelector('.sky-toast-info')).toExist();
  }));

  it('should handle closing a toast', fakeAsync(() => {
    openMessage();
    openMessage();
    openMessage();

    let toasts = getToastElements();
    expect(toasts.length).toEqual(3);

    toasts.item(0).querySelector('.sky-toast-btn-close').click();
    fixture.detectChanges();
    tick();

    toasts = getToastElements();
    expect(toasts.length).toEqual(2);
  }));

  it('should handle closing a toast instance from inside a custom component', fakeAsync(() => {
    const message = 'Hello, component!';
    openComponent(message);

    let toasts = getToastElements();
    expect(toasts.length).toEqual(1);
    expect(toasts.item(0).querySelector('.sky-toast-body-test-content')).toHaveText(message, true);

    toasts.item(0).querySelector('.sky-toast-body-test-btn-close').click();
    fixture.detectChanges();
    tick();

    toasts = getToastElements();
    expect(toasts.length).toEqual(0);
  }));

  it('should close all toasts', fakeAsync(() => {
    const cloaseAllSpy = spyOn(SkyToasterComponent.prototype, 'closeAll').and.callThrough();
    openMessage();
    openMessage();
    openMessage();

    let toasts = getToastElements();
    expect(toasts.length).toEqual(3);

    toastService.closeAll();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    toasts = getToastElements();
    expect(toasts.length).toEqual(0);
    expect(cloaseAllSpy).toHaveBeenCalled();
  }));

  it('should close all toasts', fakeAsync(() => {
    const cloaseAllSpy = spyOn(SkyToasterComponent.prototype, 'closeAll').and.callThrough();
    let toasts = getToastElements();
    expect(toasts.length).toEqual(0);

    toastService.closeAll();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    toasts = getToastElements();
    expect(toasts.length).toEqual(0);
    expect(cloaseAllSpy).not.toHaveBeenCalled();
  }));

  it('should allow click events to bubble up to the document to support 3rd-party event listeners', fakeAsync(() => {
    const message = 'Hello, component!';

    openComponent(message);

    const toaster = document.querySelector('.sky-toaster');
    const toast = document.querySelector('.sky-toast');
    const checkbox: any = toast.querySelector('.sky-toast-checkbox-test');

    expect(checkbox.checked).toEqual(false);

    let numDocumentClicks = 0;
    document.addEventListener('click', function () {
      numDocumentClicks++;
    });

    let numToasterClicks = 0;
    toaster.addEventListener('click', function () {
      numToasterClicks++;
    });

    SkyAppTestUtility.fireDomEvent(toaster, 'click');
    SkyAppTestUtility.fireDomEvent(toast, 'click');

    checkbox.click();

    expect(numDocumentClicks).toEqual(3);
    expect(numToasterClicks).toEqual(3);

    // Make sure that standard click events are still getting
    // handled within the toast component.
    expect(checkbox.checked).toEqual(true);
  }));

  it('should pass mouse and focus events to toaster service', fakeAsync(() => {
    openMessage();

    const focusInNextSpy = spyOn(toasterService.focusIn, 'next');
    const mouseOverNextSpy = spyOn(toasterService.mouseOver, 'next');

    const toaster = document.querySelector('.sky-toaster');

    function validateEvent(
      eventName: string,
      spy: jasmine.Spy,
      expectedValue: boolean
    ) {
      SkyAppTestUtility.fireDomEvent(toaster, eventName);
      expect(spy).toHaveBeenCalledWith(expectedValue);
    }

    validateEvent('focusin', focusInNextSpy, true);
    validateEvent('focusout', focusInNextSpy, false);
    validateEvent('mouseenter', mouseOverNextSpy, true);
    validateEvent('mouseleave', mouseOverNextSpy, false);
  }));

  it('should respect toast container display direction NewestOnTop', fakeAsync(() => {
    options.displayDirection = SkyToastDisplayDirection.NewestOnTop;

    openMessage('Message 1');
    openMessage('Message 2');

    let toasts = getToastElements();

    validateToastMessage(toasts[0], 'Message 2');
    validateToastMessage(toasts[1], 'Message 1');
  }));

  it('should respect toast container display direction OldestOnTop', fakeAsync(() => {
    options.displayDirection = SkyToastDisplayDirection.OldestOnTop;

    openMessage('Message 1');
    openMessage('Message 2');

    let toasts = getToastElements();

    validateToastMessage(toasts[0], 'Message 1');
    validateToastMessage(toasts[1], 'Message 2');
  }));
});
