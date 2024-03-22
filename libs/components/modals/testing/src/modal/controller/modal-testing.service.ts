import {
  EnvironmentInjector,
  Injectable,
  OnDestroy,
  Provider,
  Type,
  createComponent,
  createEnvironmentInjector,
  inject,
} from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  SkyModalCloseArgs,
  SkyModalConfigurationInterface,
  SkyModalInstance,
  SkyModalServiceInterface,
  applyDefaultOptions,
} from '@skyux/modals';

import { SkyModalTestingController } from './modal-testing.controller';

interface TestSubject<T = unknown> {
  component: Type<T>;
  config: SkyModalConfigurationInterface | Provider[] | undefined;
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
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #modals = new Map<SkyModalInstance, TestSubject>();

  public ngOnDestroy(): void {
    for (const [instance] of this.#modals.entries()) {
      instance.close();
    }
  }

  public closeTopmost(args?: SkyModalCloseArgs): void {
    const modal = this.#getTopmostModal();
    if (!modal) {
      throw new Error(
        'Expected to close the topmost modal, but no modals are open.',
      );
    }

    modal.instance.close(args);
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

  public expectTopmostOpen<T>(component: Type<T>): void {
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

  public open<T>(
    component: Type<T>,
    config?: SkyModalConfigurationInterface | Provider[],
  ): SkyModalInstance {
    const instance = new SkyModalInstance();
    const options = applyDefaultOptions(config);

    options.providers ||= [];
    options.providers.push({
      provide: SkyModalInstance,
      useValue: instance,
    });

    const environmentInjector = createEnvironmentInjector(
      options.providers,
      this.#environmentInjector,
    );

    const componentRef = createComponent(component, {
      environmentInjector,
    });

    instance.componentRef = componentRef;
    instance.componentInstance = componentRef.instance;

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
