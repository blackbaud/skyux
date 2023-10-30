import { Injectable, NgModule } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  SkyModalConfigurationInterface,
  SkyModalInstance,
  SkyModalService,
} from '@skyux/modals';

type Interface<T> = {
  [P in keyof T]: T[P];
};

// TODO: Take a look at 'skyux-spa-notification-supportal' for an example of how consumers are mocking modal service.

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
class SkyModalTestingService implements Interface<SkyModalService> {
  public dispose(): void {
    /* */
  }

  public open(
    component: any,
    config?: SkyModalConfigurationInterface | any[]
  ): SkyModalInstance {
    const instance = new SkyModalInstance();

    return instance;
  }
}

@NgModule({
  providers: [
    {
      provide: SkyModalService,
      useClass: SkyModalTestingService,
    },
  ],
})
export class SkyModalTestingModule {}
