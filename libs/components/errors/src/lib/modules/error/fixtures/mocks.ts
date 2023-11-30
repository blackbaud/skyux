import { SkyModalInstance, SkyModalService } from '@skyux/modals';

export class SkyModalInstanceMock {
  /* istanbul ignore next */
  public close() {
    /* */
  }
}

export class MockHostService {
  public getModalZIndex(): number {
    return 1;
  }
}

export interface OpenParameters {
  component: unknown;
  providers?: unknown[];
}

export class MockModalService extends SkyModalService {
  public openCalls: OpenParameters[] = [];

  public override open(
    component: unknown,
    config: unknown[]
  ): SkyModalInstance {
    this.openCalls.push({ component: component, providers: config });

    return new SkyModalInstance();
  }
}
