import {
  EventEmitter
} from '@angular/core';

import {
  SkyModalService,
  SkyModalInstance
} from '../../modal';

export class MockSkyModalInstance extends SkyModalInstance {
  public closed = new EventEmitter<any>();
  public close(result?: any) {
    this.closed.emit({
      data: result
    });
  }
  public save() {}
}

export class MockSkyModalHostService {
  public getModalZIndex(): number {
    return 1;
  }
}

export class MockSkyModalService extends SkyModalService {
  public openCalls: {
    component: any;
    config: any;
  }[] = [];
  public instance: MockSkyModalInstance;

  public open(component: any, config?: any): MockSkyModalInstance {
    this.openCalls.push({
      component,
      config
    });

    this.instance = new MockSkyModalInstance();

    return this.instance;
  }
}
