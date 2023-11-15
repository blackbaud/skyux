import { Injectable, NgModule } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  SkyModalConfigurationInterface,
  SkyModalInstance,
  SkyModalService,
} from '@skyux/modals';

/**
 * Creates an interface from a type's public properties.
 * @see https://github.com/microsoft/TypeScript/issues/471#issuecomment-381842426
 */
type Interface<T> = {
  [P in keyof T]: T[P];
};

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
class SkyModalTestingService implements Interface<SkyModalService> {
  /* istanbul ignore next */
  public dispose(): void {
    /* */
  }

  /* istanbul ignore next */
  public open(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    _component: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    _config?: SkyModalConfigurationInterface | any[]
  ): SkyModalInstance {
    return new SkyModalInstance();
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
