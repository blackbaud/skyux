import {
  Subject
} from 'rxjs';

import {
  SkyModalCloseArgs
} from '../../modal/modal-close-args';

export class MockSkyModalInstance {
  public closed = new Subject<SkyModalCloseArgs>();
  public close(result?: any) {
    this.closed.next({
      data: result,
      reason: 'save'
    });
  }

  /* istanbul ignore next */
  public save() {}
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
  public instance: MockSkyModalInstance;

  public open(component: any, config?: any): any {
    this.openCalls.push({
      component,
      config
    });

    this.instance = new MockSkyModalInstance();

    return this.instance;
  }
}
