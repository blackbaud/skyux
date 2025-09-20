import { TestBed } from '@angular/core/testing';

import { SkyModalService } from '../modal/modal.service';

import { SkyConfirmConfig } from './confirm-config';
import { SKY_CONFIRM_CONFIG } from './confirm-config-token';
import { SkyConfirmInstance } from './confirm-instance';
import { SkyConfirmComponent } from './confirm.component';
import { SkyConfirmService } from './confirm.service';
import { MockSkyModalService } from './fixtures/mocks';

describe('Confirm service', () => {
  let modalService: MockSkyModalService;
  let confirmService: SkyConfirmService;

  beforeEach(() => {
    modalService = new MockSkyModalService();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SkyModalService,
          useValue: modalService,
        },
        SkyConfirmService,
      ],
    });

    confirmService = TestBed.inject(SkyConfirmService);
  });

  it('should open confirmation dialog with correct parameters', () => {
    const config: SkyConfirmConfig = {
      message: 'dialog description',
    };

    const instance = confirmService.open(config);

    const expectedConfig = {
      providers: [
        {
          provide: SKY_CONFIRM_CONFIG,
          useValue: config,
        },
        {
          provide: SkyConfirmInstance,
          useValue: instance,
        },
      ],
    };

    expect(modalService.openCalls.length).toBe(1);
    expect(modalService.openCalls[0].component).toBe(SkyConfirmComponent);
    expect(modalService.openCalls[0].config).toEqual(expectedConfig);
  });

  it('should subscribe to the modal closed event and emit args', () => {
    const config: SkyConfirmConfig = {
      message: 'dialog description',
    };

    const instance = confirmService.open(config);

    instance.closed.subscribe((result) => {
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

    instance.closed.subscribe((result) => {
      expect(result.action).toEqual('cancel');
    });

    modalService.instance?.close();
  });
});
