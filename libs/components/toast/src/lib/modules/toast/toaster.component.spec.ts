import { ApplicationRef } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  inject,
  tick,
} from '@angular/core/testing';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';

import { SkyToastBodyTestContext } from './fixtures/toast-body-context';
import { SkyToastBodyTestComponent } from './fixtures/toast-body.component.fixture';
import { SkyToastFixturesModule } from './fixtures/toast-fixtures.module';
import { SkyToasterTestComponent } from './fixtures/toaster.component.fixture';
import { SkyToastInstance } from './toast-instance';
import { SkyToastService } from './toast.service';
import { SkyToasterComponent } from './toaster.component';
import { SkyToasterService } from './toaster.service';
import { SkyToastConfig } from './types/toast-config';
import { SkyToastContainerOptions } from './types/toast-container-options';
import { SkyToastDisplayDirection } from './types/toast-display-direction';
import { SkyToastType } from './types/toast-type';

describe('Toaster component', () => {
  let fixture: ComponentFixture<SkyToasterTestComponent>;
  let toastService: SkyToastService;
  let toasterService: SkyToasterService;
  let applicationRef: ApplicationRef;
  let options: SkyToastContainerOptions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyToastFixturesModule],
      providers: [
        {
          provide: SkyToastContainerOptions,
          useValue: {
            displayDirection: SkyToastDisplayDirection.OldestOnTop,
          } as SkyToastContainerOptions,
        }],
    });

    toasterService = new SkyToasterService();

    fixture = TestBed.overrideComponent(SkyToasterComponent, {
      add: {
        providers: [
          {
            provide: SkyToasterService,
            useValue: toasterService,
          }],
      },
    }).createComponent(SkyToasterTestComponent);
  });

  beforeEach(inject(
    [ApplicationRef, SkyToastService, SkyToastContainerOptions],
    (
      _applicationRef: ApplicationRef,
      _toastService: SkyToastService,
      _options: SkyToastContainerOptions,
    ) => {
      applicationRef = _applicationRef;
      toastService = _toastService;
      options = _options;
    },
  ));

  afterEach(fakeAsync(() => {
    toastService.ngOnDestroy();
    applicationRef.tick();
    tick();
    fixture.detectChanges();
    fixture.destroy();
  }));

  function getToastElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll('sky-toast');
  }

  function dispatchTransitionEnd(toastEl: Element): void {
    const aside = toastEl.querySelector('aside');
    aside?.dispatchEvent(
      new TransitionEvent('transitionend', { propertyName: 'opacity' }),
    );
  }

  function openMessage(
    message = '',
    config?: SkyToastConfig,
  ): SkyToastInstance {
    const instance = toastService.openMessage(message, config);
    fixture.detectChanges();
    tick();
    return instance;
  }

  function openComponent(message = ''): SkyToastInstance {
    const providers = [
      {
        provide: SkyToastBodyTestContext,
        useValue: new SkyToastBodyTestContext(message),
      }];
    const instance = toastService.openComponent(
      SkyToastBodyTestComponent,
      {},
      providers,
    );
    fixture.detectChanges();
    tick();
    return instance;
  }

  function validateToastMessage(toastEl: Element, message: string): void {
    expect(toastEl.querySelector('.sky-toast-content')).toHaveText(
      message,
      true,
    );
  }

  function clickElement(el: HTMLElement | null): void {
    el?.click();
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
    expect(
      toasts.item(0).querySelector('sky-icon-svg[data-sky-icon="info"]'),
    ).toExist();
  }));

  it('should display a toast component with a type set', fakeAsync(() => {
    const message = 'Hello, World!';
    openMessage(message, { type: SkyToastType.Danger });

    const toasts = getToastElements();
    expect(toasts.length).toEqual(1);
    validateToastMessage(toasts[0], message);
    expect(toasts.item(0).querySelector('.sky-toast-danger')).toExist();
    expect(
      toasts.item(0).querySelector('sky-icon-svg[data-sky-icon="warning"]'),
    ).toExist();
  }));

  it('should handle closing a toast', fakeAsync(() => {
    openMessage();
    openMessage();
    openMessage();

    let toasts = getToastElements();
    expect(toasts.length).toEqual(3);

    (
      toasts.item(0).querySelector('.sky-toast-btn-close') as HTMLElement
    )?.click();
    fixture.detectChanges();
    tick();

    // A transitionend event for a non-opacity property should not close the toast.
    toasts
      .item(0)
      .querySelector('aside')
      ?.dispatchEvent(
        new TransitionEvent('transitionend', { propertyName: 'transform' }),
      );
    fixture.detectChanges();
    tick();

    toasts = getToastElements();
    expect(toasts.length).toEqual(3);

    dispatchTransitionEnd(toasts.item(0));
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
    expect(
      toasts.item(0).querySelector('.sky-toast-body-test-content'),
    ).toHaveText(message, true);

    clickElement(
      toasts.item(0).querySelector('.sky-toast-body-test-btn-close'),
    );
    fixture.detectChanges();
    tick();

    dispatchTransitionEnd(toasts.item(0));
    fixture.detectChanges();
    tick();

    toasts = getToastElements();
    expect(toasts.length).toEqual(0);
  }));

  it('should close all toasts', fakeAsync(() => {
    const closeAllSpy = spyOn(
      SkyToasterComponent.prototype,
      'closeAll',
    ).and.callThrough();
    openMessage();
    openMessage();
    openMessage();

    let toasts = getToastElements();
    expect(toasts.length).toEqual(3);

    toastService.closeAll();
    fixture.detectChanges();
    tick();

    toasts = getToastElements();
    toasts.forEach((toast) => dispatchTransitionEnd(toast));
    fixture.detectChanges();
    tick();

    toasts = getToastElements();
    expect(toasts.length).toEqual(0);
    expect(closeAllSpy).toHaveBeenCalled();
  }));

  it('should close all toasts', fakeAsync(() => {
    const closeAllSpy = spyOn(
      SkyToasterComponent.prototype,
      'closeAll',
    ).and.callThrough();
    let toasts = getToastElements();
    expect(toasts.length).toEqual(0);

    toastService.closeAll();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    toasts = getToastElements();
    expect(toasts.length).toEqual(0);
    expect(closeAllSpy).not.toHaveBeenCalled();
  }));

  it('should allow click events to bubble up to the document to support 3rd-party event listeners', fakeAsync(() => {
    const message = 'Hello, component!';

    openComponent(message);

    const toaster = document.querySelector('.sky-toaster');
    const toast = document.querySelector('.sky-toast');
    const checkbox = toast?.querySelector(
      '.sky-toast-checkbox-test',
    ) as HTMLInputElement;

    expect(checkbox?.checked).toEqual(false);

    let numDocumentClicks = 0;
    document.addEventListener('click', function () {
      numDocumentClicks++;
    });

    let numToasterClicks = 0;
    toaster?.addEventListener('click', function () {
      numToasterClicks++;
    });

    if (toaster) {
      SkyAppTestUtility.fireDomEvent(toaster, 'click');
    }
    if (toast) {
      SkyAppTestUtility.fireDomEvent(toast, 'click');
    }

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
      expectedValue: boolean,
    ) {
      if (toaster) {
        SkyAppTestUtility.fireDomEvent(toaster, eventName);
      }
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

    const toasts = getToastElements();

    validateToastMessage(toasts[0], 'Message 2');
    validateToastMessage(toasts[1], 'Message 1');
  }));

  it('should respect toast container display direction OldestOnTop', fakeAsync(() => {
    options.displayDirection = SkyToastDisplayDirection.OldestOnTop;

    openMessage('Message 1');
    openMessage('Message 2');

    const toasts = getToastElements();

    validateToastMessage(toasts[0], 'Message 1');
    validateToastMessage(toasts[1], 'Message 2');
  }));
});
