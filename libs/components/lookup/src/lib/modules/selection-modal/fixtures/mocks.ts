import { SkyModalCloseArgs } from '@skyux/modals';

import { Subject } from 'rxjs';

export class MockSkyModalInstance {
  public closed = new Subject<SkyModalCloseArgs>();
  public close(result?: any): void {
    this.closed.next({
      data: result,
      reason: 'save',
    });
  }

  /* istanbul ignore next */
  public save(): void {
    return;
  }
}

export class MockSkyModalHostService {
  public getModalZIndex(): number {
    return 1;
  }
}

export class MockSkyModalService {
  public openCalls: {
    component: any;
    config: any;
  }[] = [];
  public instance: MockSkyModalInstance | undefined;

  public open(component: any, config?: any): any {
    this.openCalls.push({
      component,
      config,
    });

    this.instance = new MockSkyModalInstance();

    return this.instance;
  }
}
