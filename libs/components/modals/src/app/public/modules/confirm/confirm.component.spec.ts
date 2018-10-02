import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  SkyAppResourcesService
} from '@skyux/i18n';

import {
  SkyAppResourcesTestService
} from '@skyux/i18n/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyModalInstance,
  SkyModalHostService,
  SkyModalConfiguration,
  SkyModalModule
} from '../modal';

import {
  MockSkyModalHostService,
  MockSkyModalInstance
} from './fixtures/mocks';

import {
  SkyConfirmConfig,
  SkyConfirmType
} from './types';

import {
  SkyConfirmModule
} from './confirm.module';

import {
  SkyConfirmComponent
} from './confirm.component';

import {
  SkyConfirmModalContext
} from './confirm-modal-context';

describe('Confirm component', () => {
  const modalInstance = new MockSkyModalInstance();
  const modalHost = new MockSkyModalHostService();

  function createConfirm(config: SkyConfirmConfig): ComponentFixture<SkyConfirmComponent> {
    TestBed.overrideComponent(SkyConfirmComponent, { set: {
      providers: [
        { provide: SkyConfirmModalContext, useValue: config },
        { provide: SkyModalInstance, useValue: modalInstance },
        { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService }
      ]
    }});

    return TestBed.createComponent(SkyConfirmComponent);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyModalModule,
        SkyConfirmModule
      ],
      providers: [
        { provide: SkyModalHostService, useValue: modalHost },
        { provide: SkyModalConfiguration, useValue: {} }
      ]
    });
  });

  afterEach(() => {
    // Cleanup after unit tests.
    // TODO: Figure out a better way to do this!
    const element = document.querySelector('.sky-confirm');
    element.parentNode.removeChild(element);
  });

  it('should display an OK confirm by default', async(() => {
    const fixture = createConfirm({
      message: 'confirm message'
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector('.sky-confirm-message');
    const buttons = fixture.nativeElement.querySelectorAll('.sky-confirm-buttons .sky-btn');

    expect(messageElem).toHaveText('confirm message');
    expect(buttons.length).toEqual(1);
    expect(buttons[0]).toHaveText('OK');
    buttons[0].click();
  }));

  it('should display an OK confirm', async(() => {
    const fixture = createConfirm({
      message: 'confirm message',
      type: SkyConfirmType.OK
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector('.sky-confirm-message');
    const buttons = fixture.nativeElement.querySelectorAll('.sky-confirm-buttons .sky-btn');

    expect(messageElem).toHaveText('confirm message');
    expect(buttons.length).toEqual(1);
    expect(buttons[0]).toHaveText('OK');
    buttons[0].click();
  }));

  it('should display an OK confirm with body', async(() => {
    const fixture = createConfirm({
      message: 'confirm message',
      body: 'additional text',
      type: SkyConfirmType.OK
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector('.sky-confirm-message');
    const bodyElem = fixture.nativeElement.querySelector('.sky-confirm-body');
    const buttons = fixture.nativeElement.querySelectorAll('.sky-confirm-buttons .sky-btn');

    expect(messageElem).toHaveText('confirm message');
    expect(bodyElem).toHaveText('additional text');
    expect(buttons.length).toEqual(1);
    expect(buttons[0]).toHaveText('OK');
    buttons[0].click();
  }));

  it('should display a YesCancel confirm', async(() => {
    const fixture = createConfirm({
      message: 'confirm message',
      type: SkyConfirmType.YesCancel
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector('.sky-confirm-message');
    const buttons = fixture.nativeElement.querySelectorAll('.sky-confirm-buttons .sky-btn');

    expect(messageElem).toHaveText('confirm message');
    expect(buttons.length).toEqual(2);
    expect(buttons[0]).toHaveText('Yes');
    expect(buttons[1]).toHaveText('Cancel');
    buttons[0].click();
  }));

  it('should display a YesNoCancel confirm', async(() => {
    const fixture = createConfirm({
      message: 'confirm message',
      type: SkyConfirmType.YesNoCancel
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector('.sky-confirm-message');
    const buttons = fixture.nativeElement.querySelectorAll('.sky-confirm-buttons .sky-btn');

    expect(messageElem).toHaveText('confirm message');
    expect(buttons.length).toEqual(3);
    expect(buttons[0]).toHaveText('Yes');
    expect(buttons[1]).toHaveText('No');
    expect(buttons[2]).toHaveText('Cancel');
    buttons[0].click();
  }));

  it('should display a custom confirm', async(() => {
    const fixture = createConfirm({
      message: 'confirm message',
      type: SkyConfirmType.Custom,
      buttons: [
        {
          text: 'Custom label',
          action: 'foo'
        }
      ]
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector('.sky-confirm-message');
    const buttons = fixture.nativeElement.querySelectorAll('.sky-confirm-buttons .sky-btn');

    expect(messageElem).toHaveText('confirm message');
    expect(buttons.length).toEqual(1);
    expect(buttons[0]).toHaveText('Custom label');
    buttons[0].click();
  }));

  it('should handle incorrect button config', async(() => {
    const fixture = createConfirm({
      message: 'confirm message',
      type: SkyConfirmType.Custom,
      buttons: [
        {
          text: undefined,
          foo: true
        }
      ] as any
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector('.sky-confirm-message');
    const buttons = fixture.nativeElement.querySelectorAll('.sky-confirm-buttons .sky-btn');

    expect(messageElem).toHaveText('confirm message');
    expect(buttons.length).toEqual(1);
    expect(buttons[0]).toHaveText('');
    buttons[0].click();
  }));

  it('should default to OK confirm if buttons not provided with custom type', async(() => {
    const fixture = createConfirm({
      message: 'confirm message',
      type: SkyConfirmType.Custom,
      buttons: []
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector('.sky-confirm-message');
    const buttons = fixture.nativeElement.querySelectorAll('.sky-confirm-buttons .sky-btn');

    expect(messageElem).toHaveText('confirm message');
    expect(buttons.length).toEqual(1);
    expect(buttons[0]).toHaveText('OK');
    buttons[0].click();
  }));

  it('should invoke close method and return arguments', async(() => {
    const fixture = createConfirm({
      message: 'confirm message'
    });

    const spy = spyOn(modalInstance, 'close');

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.sky-confirm-buttons .sky-btn');

    button.click();

    expect(spy).toHaveBeenCalledWith({
      action: 'ok'
    });
  }));

  it('should autofocus specified button from config', async(() => {
    const fixture = createConfirm({
      message: 'confirm message',
      type: SkyConfirmType.Custom,
      buttons: [
        {
          text: 'foo',
          action: 'foo'
        },
        {
          text: 'bar',
          action: 'bar'
        },
        {
          text: 'baz',
          action: 'baz',
          autofocus: true
        }
      ]
    });

    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.sky-confirm-buttons .sky-btn');

    expect(buttons[0].hasAttribute('autofocus')).toEqual(false);
    expect(buttons[1].hasAttribute('autofocus')).toEqual(false);
    expect(buttons[2].hasAttribute('autofocus')).toEqual(true);
    buttons[0].click();
  }));
});
