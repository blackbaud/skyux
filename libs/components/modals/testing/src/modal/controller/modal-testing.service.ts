import { Injectable, OnDestroy, StaticProvider, Type } from '@angular/core';
import {
  SkyModalCloseArgs,
  SkyModalConfigurationInterface,
  SkyModalInstance,
  SkyModalServiceInterface,
} from '@skyux/modals';

import { SkyModalTestingController } from './modal-testing.controller';

interface TestSubject<T = unknown> {
  component: Type<T>;
  config: SkyModalConfigurationInterface | StaticProvider[] | undefined;
  instance: SkyModalInstance;
}

/**
 * @internal
 */
@Injectable()
export class SkyModalTestingService
  extends SkyModalTestingController
  implements OnDestroy, SkyModalServiceInterface
{
  readonly #modals = new Map<SkyModalInstance, TestSubject>();

  public ngOnDestroy(): void {
    for (const instance of this.#modals.keys()) {
      instance.close();
    }
  }

  public closeTopModal(args?: SkyModalCloseArgs): void {
    const modal = this.#getTopmostModal();
    if (!modal) {
      throw new Error(
        'Expected to close the topmost modal, but no modals are open.',
      );
    }

    modal.instance.close(args?.data, args?.reason);
  }

  public expectCount(value: number): void {
    const count = this.#modals.size;
    if (count !== value) {
      throw new Error(
        `Expected ${value} open ${value === 1 ? 'modal' : 'modals'}, but ${count} ${count === 1 ? 'is' : 'are'} open.`,
      );
    }
  }

  public expectNone(): void {
    const count = this.#modals.size;
    if (count > 0) {
      throw new Error(
        `Expected no modals to be open, but there ${count === 1 ? 'is' : 'are'} ${count} open.`,
      );
    }
  }

  public expectOpen<TComponent>(component: Type<TComponent>): void {
    const modal = this.#getTopmostModal();
    if (!modal) {
      throw new Error(
        'A modal is expected to be open, but no modals are open.',
      );
    }

    if (modal.component !== component) {
      throw new Error(
        `Expected the topmost modal to be of type ${component.name}, but it is of type ${modal.component.name}.`,
      );
    }
  }

  public open<TComponent>(
    component: Type<TComponent>,
    config?: SkyModalConfigurationInterface | StaticProvider[],
  ): SkyModalInstance {
    const instance = new SkyModalInstance();

    instance.closed.subscribe(() => {
      this.#modals.delete(instance);
    });

    this.#modals.set(instance, { component, config, instance });

    return instance;
  }

  #getTopmostModal(): TestSubject | undefined {
    return Array.from(this.#modals.values()).pop();
  }
}
