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

describe('Toast component', () => {
  let fixture: ComponentFixture<SkyToasterTestComponent>;
  let toastService: SkyToastService;
  let applicationRef: ApplicationRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyToastFixturesModule,
        NoopAnimationsModule
      ]
    });

    fixture = TestBed.createComponent(SkyToasterTestComponent);
  });

  beforeEach(inject(
    [ApplicationRef, SkyToastService],
    (
      _applicationRef: ApplicationRef,
      _toastService: SkyToastService
    ) => {
      applicationRef = _applicationRef;
      toastService = _toastService;
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
    expect(toasts.item(0).querySelector('.sky-toast-content')).toHaveText(message, true);
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
  }));

  it('should prevent click events from bubbling beyond toast components', fakeAsync(() => {
    openMessage();
    const toaster = document.querySelector('.sky-toaster');
    const toast = document.querySelector('.sky-toast');
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

    expect(numDocumentClicks).toEqual(0);
    expect(numToasterClicks).toEqual(2);
  }));
});
