import { TestBed } from '@angular/core/testing';
import { SkyLogService } from '@skyux/core';

import { SkyConfirmConfig } from './confirm-config';
import { SKY_CONFIRM_CONFIG } from './confirm-config-token';
import { SkyConfirmType } from './confirm-type';
import { SkyConfirmComponent } from './confirm.component';
import { SkyConfirmService } from './confirm.service';
import { MockSkyModalService } from './fixtures/mocks';

describe('Confirm service', () => {
  let modalService: MockSkyModalService;
  let confirmService: SkyConfirmService;

  beforeEach(() => {
    modalService = new MockSkyModalService();
    confirmService = new SkyConfirmService(
      modalService as any,
      TestBed.inject(SkyLogService)
    );
  });

  it('should open confirmation dialog with correct parameters', () => {
    const config: SkyConfirmConfig = {
      message: 'dialog description',
    };

    const expectedConfig = {
      providers: [
        {
          provide: SKY_CONFIRM_CONFIG,
          useValue: config,
        },
      ],
    };

    const logServiceSpy = spyOn(
      SkyLogService.prototype,
      'deprecated'
    ).and.stub();

    confirmService.open(config);

    expect(modalService.openCalls.length).toBe(1);
    expect(modalService.openCalls[0].component).toBe(SkyConfirmComponent);
    expect(modalService.openCalls[0].config).toEqual(expectedConfig);
    expect(logServiceSpy).not.toHaveBeenCalled();
  });

  it('should open confirmation dialog with correct parameters and warn of deprecated property', () => {
    const config: SkyConfirmConfig = {
      message: 'dialog description',
      type: SkyConfirmType.Custom,
      buttons: [
        { text: 'OK', styleType: 'primary', action: 'save' },
        { text: 'Cancel', autofocus: true, action: 'cancel' },
      ],
    };

    const expectedConfig = {
      providers: [
        {
          provide: SKY_CONFIRM_CONFIG,
          useValue: config,
        },
      ],
    };

    const logServiceSpy = spyOn(
      SkyLogService.prototype,
      'deprecated'
    ).and.stub();

    confirmService.open(config);

    expect(modalService.openCalls.length).toBe(1);
    expect(modalService.openCalls[0].component).toBe(SkyConfirmComponent);
    expect(modalService.openCalls[0].config).toEqual(expectedConfig);
    expect(logServiceSpy).toHaveBeenCalledWith('autofocus');
  });

  it('should subscribe to the modal closed event and emit args', () => {
    const config: SkyConfirmConfig = {
      message: 'dialog description',
    };

    const instance = confirmService.open(config);

    instance.closed.subscribe((result: any) => {
      expect(result.action).toEqual('ok');
    });

    modalService.instance?.close({
      action: 'ok',
    });
  });

  it('should handle undefined modal closed args', () => {
    const config: SkyConfirmConfig = {
      message: 'dialog description',
    };

    const instance = confirmService.open(config);

    instance.closed.subscribe((result: any) => {
      expect(result.action).toEqual('cancel');
    });

    modalService.instance?.close();
  });
});
