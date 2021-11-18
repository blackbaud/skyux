import { ViewContainerRef } from '@angular/core';

import { SkyModalAdapterService } from '../modal-adapter.service';

export class MockSkyModalAdapterService extends SkyModalAdapterService {
  public hostViewContainer: ViewContainerRef;

  public getModalHostViewContainer(): ViewContainerRef {
    return this.hostViewContainer;
  }
}
