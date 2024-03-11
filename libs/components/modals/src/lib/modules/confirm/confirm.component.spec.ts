import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyModalConfiguration } from '../modal/modal-configuration';
import { SkyModalHostService } from '../modal/modal-host.service';
import { SkyModalInstance } from '../modal/modal-instance';

import { SkyConfirmConfig } from './confirm-config';
import { SKY_CONFIRM_CONFIG } from './confirm-config-token';
import { SkyConfirmInstance } from './confirm-instance';
import { SkyConfirmType } from './confirm-type';
import { SkyConfirmComponent } from './confirm.component';
import {
  MockSkyModalHostService,
  MockSkyModalInstance,
} from './fixtures/mocks';

describe('Confirm component', () => {
  const modalInstance = new MockSkyModalInstance();
  const modalHost = new MockSkyModalHostService();

  let confirmInstance: SkyConfirmInstance;

  function createConfirm(
    config: SkyConfirmConfig,
  ): ComponentFixture<SkyConfirmComponent> {
    confirmInstance = new SkyConfirmInstance();

    TestBed.overrideComponent(SkyConfirmComponent, {
      set: {
        providers: [
          { provide: SKY_CONFIRM_CONFIG, useValue: config },
          { provide: SkyConfirmInstance, useValue: confirmInstance },
          { provide: SkyModalInstance, useValue: modalInstance },
        ],
      },
    });

    return TestBed.createComponent(SkyConfirmComponent);
  }

  beforeEach(() => {
    confirmInstance = new SkyConfirmInstance();

    TestBed.configureTestingModule({
      providers: [
        { provide: SkyModalHostService, useValue: modalHost },
        { provide: SkyConfirmInstance, useValue: confirmInstance },
        { provide: SkyModalConfiguration, useValue: {} },
      ],
    });
  });

  it('should display an OK confirm by default', () => {
    const fixture = createConfirm({
      message: 'confirm message',
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector(
      '.sky-confirm-message',
    );
    const buttons = fixture.nativeElement.querySelectorAll(
      '.sky-confirm-buttons .sky-btn',
    );

    expect(messageElem).toHaveText('confirm message');
    expect(buttons.length).toEqual(1);
    expect(buttons[0]).toHaveText('OK');
    buttons[0].click();
  });

  it('should display an OK confirm', () => {
    const fixture = createConfirm({
      message: 'confirm message',
      type: SkyConfirmType.OK,
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector(
      '.sky-confirm-message',
    );
    const buttons = fixture.nativeElement.querySelectorAll(
      '.sky-confirm-buttons .sky-btn',
    );

    expect(messageElem).toHaveText('confirm message');
    expect(buttons.length).toEqual(1);
    expect(buttons[0]).toHaveText('OK');
    buttons[0].click();
  });

  it('should display an OK confirm with body', () => {
    const fixture = createConfirm({
      message: 'confirm message',
      body: 'additional text',
      type: SkyConfirmType.OK,
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector(
      '.sky-confirm-message',
    );
    const bodyElem = fixture.nativeElement.querySelector('.sky-confirm-body');
    const buttons = fixture.nativeElement.querySelectorAll(
      '.sky-confirm-buttons .sky-btn',
    );

    expect(messageElem).toHaveText('confirm message');
    expect(bodyElem).toHaveText('additional text');
    expect(buttons.length).toEqual(1);
    expect(buttons[0]).toHaveText('OK');
    buttons[0].click();
  });

  it('should display a YesCancel confirm', () => {
    const fixture = createConfirm({
      message: 'confirm message',
      type: SkyConfirmType.YesCancel,
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector(
      '.sky-confirm-message',
    );
    const buttons = fixture.nativeElement.querySelectorAll(
      '.sky-confirm-buttons .sky-btn',
    );

    expect(messageElem).toHaveText('confirm message');
    expect(buttons.length).toEqual(2);
    expect(buttons[0]).toHaveText('Yes');
    expect(buttons[1]).toHaveText('Cancel');
    buttons[0].click();
  });

  it('should display a YesNoCancel confirm', () => {
    const fixture = createConfirm({
      message: 'confirm message',
      type: SkyConfirmType.YesNoCancel,
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector(
      '.sky-confirm-message',
    );
    const buttons = fixture.nativeElement.querySelectorAll(
      '.sky-confirm-buttons .sky-btn',
    );

    expect(messageElem).toHaveText('confirm message');
    expect(buttons.length).toEqual(3);
    expect(buttons[0]).toHaveText('Yes');
    expect(buttons[1]).toHaveText('No');
    expect(buttons[2]).toHaveText('Cancel');
    buttons[0].click();
  });

  it('should display a custom confirm', () => {
    const fixture = createConfirm({
      message: 'confirm message',
      type: SkyConfirmType.Custom,
      buttons: [
        {
          text: 'Custom label',
          action: 'foo',
        },
      ],
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector(
      '.sky-confirm-message',
    );
    const buttons = fixture.nativeElement.querySelectorAll(
      '.sky-confirm-buttons .sky-btn',
    );

    expect(messageElem).toHaveText('confirm message');
    expect(buttons.length).toEqual(1);
    expect(buttons[0]).toHaveText('Custom label');
    buttons[0].click();
  });

  it('should handle incorrect button config', () => {
    const fixture = createConfirm({
      message: 'confirm message',
      type: SkyConfirmType.Custom,
      buttons: [
        {
          text: undefined,
          foo: true,
        },
      ] as any,
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector(
      '.sky-confirm-message',
    );
    const buttons = fixture.nativeElement.querySelectorAll(
      '.sky-confirm-buttons .sky-btn',
    );

    expect(messageElem).toHaveText('confirm message');
    expect(buttons.length).toEqual(1);
    expect(buttons[0]).toHaveText('');
    buttons[0].click();
  });

  it('should default to OK confirm if buttons not provided with custom type', () => {
    const fixture = createConfirm({
      message: 'confirm message',
      type: SkyConfirmType.Custom,
      buttons: [],
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector(
      '.sky-confirm-message',
    );
    const buttons = fixture.nativeElement.querySelectorAll(
      '.sky-confirm-buttons .sky-btn',
    );

    expect(messageElem).toHaveText('confirm message');
    expect(buttons.length).toEqual(1);
    expect(buttons[0]).toHaveText('OK');
    buttons[0].click();
  });

  it('should invoke close method and return arguments', () => {
    const fixture = createConfirm({
      message: 'confirm message',
    });

    const spy = spyOn(modalInstance, 'close');

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      '.sky-confirm-buttons .sky-btn',
    );

    button.click();

    expect(spy).toHaveBeenCalledWith({
      action: 'ok',
    });
  });

  it('should autofocus specified button from config', () => {
    const fixture = createConfirm({
      message: 'confirm message',
      type: SkyConfirmType.Custom,
      buttons: [
        {
          text: 'foo',
          action: 'foo',
        },
        {
          text: 'bar',
          action: 'bar',
        },
        {
          text: 'baz',
          action: 'baz',
          autofocus: true,
        },
      ],
    });

    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      '.sky-confirm-buttons .sky-btn',
    );

    expect(buttons[0].hasAttribute('autofocus')).toEqual(false);
    expect(buttons[1].hasAttribute('autofocus')).toEqual(false);
    expect(buttons[2].hasAttribute('autofocus')).toEqual(true);
    buttons[0].click();
  });

  it('should default to not preserving white space', () => {
    const fixture = createConfirm({
      message: 'confirm message',
      body: 'additional text',
      type: SkyConfirmType.OK,
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector(
      '.sky-confirm-message',
    );
    const bodyElem = fixture.nativeElement.querySelector('.sky-confirm-body');
    const buttons = fixture.nativeElement.querySelectorAll(
      '.sky-confirm-buttons .sky-btn',
    );

    expect(messageElem.classList).not.toContain(
      'sky-confirm-preserve-white-space',
    );
    expect(bodyElem.classList).not.toContain(
      'sky-confirm-preserve-white-space',
    );

    buttons[0].click();
  });

  it('should allow preserving white space', () => {
    const fixture = createConfirm({
      message: 'confirm message',
      body: 'additional text',
      preserveWhiteSpace: true,
      type: SkyConfirmType.OK,
    });

    fixture.detectChanges();

    const messageElem = fixture.nativeElement.querySelector(
      '.sky-confirm-message',
    );
    const bodyElem = fixture.nativeElement.querySelector('.sky-confirm-body');
    const buttons = fixture.nativeElement.querySelectorAll(
      '.sky-confirm-buttons .sky-btn',
    );

    expect(messageElem.classList).toContain('sky-confirm-preserve-white-space');
    expect(bodyElem.classList).toContain('sky-confirm-preserve-white-space');

    // Check innerHTML directly instead of using `toHaveText()` to ensure
    // extra whitespace is not added to the beginning or end of the content.
    expect(messageElem.innerHTML).toBe('confirm message');
    expect(bodyElem.innerHTML).toBe('additional text');

    buttons[0].click();
  });

  it('should close when the escape key is pressed', () => {
    const fixture = createConfirm({
      message: 'confirm message',
    });

    fixture.detectChanges();

    const closeSpy = spyOn(confirmInstance, 'close');
    modalInstance.close();

    fixture.detectChanges();

    expect(closeSpy).toHaveBeenCalledWith({ action: 'cancel' });
  });

  describe('accessibility', () => {
    async function verifyAccessibility(
      config: SkyConfirmConfig,
    ): Promise<void> {
      const fixture = createConfirm(config);

      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll(
        '.sky-confirm-buttons .sky-btn',
      );

      await expectAsync(fixture.nativeElement).toBeAccessible();

      buttons[0].click();
    }

    it('should be accessible when displaying an OK confirm', async () => {
      await verifyAccessibility({
        message: 'confirm message',
        type: SkyConfirmType.OK,
      });
    });

    it('should be accessible when displaying an OK confirm with body', async () => {
      await verifyAccessibility({
        message: 'confirm message',
        body: 'additional text',
        type: SkyConfirmType.OK,
      });
    });

    it('should be accessible when displaying a YesCancel confirm', async () => {
      await verifyAccessibility({
        message: 'confirm message',
        type: SkyConfirmType.YesCancel,
      });
    });

    it('should be accessible when displaying a YesNoCancel confirm with body', async () => {
      await verifyAccessibility({
        message: 'confirm message',
        body: 'additional text',
        type: SkyConfirmType.YesNoCancel,
      });
    });

    it('should be accessible when displaying a YesNoCancel confirm', async () => {
      await verifyAccessibility({
        message: 'confirm message',
        type: SkyConfirmType.YesNoCancel,
      });
    });

    it('should be accessible when displaying a YesNoCancel confirm with body', async () => {
      await verifyAccessibility({
        message: 'confirm message',
        body: 'additional text',
        type: SkyConfirmType.YesNoCancel,
      });
    });

    it('should be accessible when displaying a custom confirm', async () => {
      await verifyAccessibility({
        message: 'confirm message',
        type: SkyConfirmType.Custom,
        buttons: [
          {
            text: 'Custom label',
            action: 'foo',
          },
        ],
      });
    });

    it('should be accessible when displaying a custom confirm with body', async () => {
      await verifyAccessibility({
        message: 'confirm message',
        body: 'additional text',
        type: SkyConfirmType.Custom,
        buttons: [
          {
            text: 'Custom label',
            action: 'foo',
          },
        ],
      });
    });

    it('should be accessible when displaying a custom confirm with all button types', async () => {
      await verifyAccessibility({
        message: 'confirm message',
        body: 'additional text',
        type: SkyConfirmType.Custom,
        buttons: [
          {
            text: 'Custom label',
            action: 'foo',
          },
          {
            text: 'Custom label',
            action: 'bar',
            styleType: 'primary',
          },
          {
            text: 'Custom label',
            action: 'buz',
            styleType: 'default',
          },
          {
            text: 'Custom label',
            action: 'baz',
            styleType: 'link',
          },
        ],
      });
    });

    it('should be accessible when autofocus is specified on a button from the config', async () => {
      await verifyAccessibility({
        message: 'confirm message',
        type: SkyConfirmType.Custom,
        buttons: [
          {
            text: 'foo',
            action: 'foo',
          },
          {
            text: 'bar',
            action: 'bar',
          },
          {
            text: 'baz',
            action: 'baz',
            autofocus: true,
          },
        ],
      });
    });

    it('should be accessible when preserving white space', async () => {
      await verifyAccessibility({
        message: 'confirm message',
        body: 'additional text',
        preserveWhiteSpace: true,
        type: SkyConfirmType.OK,
      });
    });
  });
});
