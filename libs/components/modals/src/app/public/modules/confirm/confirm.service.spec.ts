import {
  SkyConfirmService
} from './confirm.service';

import {
  SkyConfirmConfig
} from './types';

import {
  MockSkyModalService
} from './fixtures/mocks';

import {
  SkyConfirmComponent
} from './confirm.component';

import {
  SkyConfirmModalContext
} from './confirm-modal-context';

describe('Confirm service', () => {
  let modalService: MockSkyModalService;
  let confirmService: SkyConfirmService;

  beforeEach(() => {
    modalService = new MockSkyModalService(
      {
        removeComponent: function (): any {},
        addComponent: function (ref: any): any {}
      } as any
    );
    confirmService = new SkyConfirmService(modalService);
  });

  it('should open confirmation dialog with correct parameters', () => {
    const config: SkyConfirmConfig = {
      message: 'dialog description'
    };

    const expectedConfig = {
      providers: [{
        provide: SkyConfirmModalContext,
        useValue: config
      }]
    };

    confirmService.open(config);

    expect(modalService.openCalls.length).toBe(1);
    expect(modalService.openCalls[0].component).toBe(SkyConfirmComponent);
    expect(modalService.openCalls[0].config).toEqual(expectedConfig);
  });

  it('should subscribe to the modal closed event and emit args', () => {
    const config: SkyConfirmConfig = {
      message: 'dialog description'
    };

    const instance = confirmService.open(config);

    instance.closed.subscribe((result: any) => {
      expect(result.action).toEqual('ok');
    });

    modalService.instance.close({
      action: 'ok'
    });
  });

  it('should handle undefined modal closed args', () => {
    const config: SkyConfirmConfig = {
      message: 'dialog description'
    };

    const instance = confirmService.open(config);

    instance.closed.subscribe((result: any) => {
      expect(result.action).toEqual('cancel');
    });

    modalService.instance.close();
  });
});
