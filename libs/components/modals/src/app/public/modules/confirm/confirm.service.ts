import {
  Injectable
} from '@angular/core';

import {
  SkyModalService,
  SkyModalInstance,
  SkyModalCloseArgs
} from '../modal';

import {
  SkyConfirmCloseEventArgs,
  SkyConfirmConfig
} from './types';

import {
  SkyConfirmModalContext
} from './confirm-modal-context';

import {
  SkyConfirmComponent
} from './confirm.component';

import {
  SkyConfirmInstance
} from './confirm-instance';

@Injectable()
export class SkyConfirmService {
  constructor(
    private modalService: SkyModalService
  ) { }

  public open(config: SkyConfirmConfig): SkyConfirmInstance {
    const modalInstance: SkyModalInstance = this.modalService.open(
      SkyConfirmComponent,
      {
        providers: [{
          provide: SkyConfirmModalContext,
          useValue: config
        }]
      }
    );

    const confirmInstance = new SkyConfirmInstance();

    modalInstance.closed.subscribe((args: SkyModalCloseArgs) => {
      let result: SkyConfirmCloseEventArgs = args.data;

      // The modal was closed using the ESC key.
      if (result === undefined) {
        result = {
          action: 'cancel'
        };
      }

      confirmInstance.closed.emit(result);
      confirmInstance.closed.complete();
    });

    return confirmInstance;
  }
}
