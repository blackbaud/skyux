/* eslint-disable @nx/enforce-module-boundaries */
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
import {
  SkyModalCloseArgs,
  SkyModalConfigurationInterface,
  SkyModalInstance,
  SkyModalServiceInterface,
  applyDefaultOptions,
} from '@skyux/modals';

// import { SkyModalTestInstance } from './modal-test-instance';
import { SkyModalTestingController } from './modal-testing.controller';

interface TestSubject<T = unknown> {
  component: Type<T>;
  config: SkyModalConfigurationInterface | Provider[] | undefined;
  instance: SkyModalInstance;
}

// function isSkyModalConfigurationInterface(
//   value: unknown,
// ): value is SkyModalConfigurationInterface {
//   return (
//     value !== undefined && typeof value === 'object' && !Array.isArray(value)
//   );
// }

// function hasEqualProviders(
//   configA: SkyModalConfigurationInterface | Provider[] | undefined,
//   configB: SkyModalConfigurationInterface | Provider[] | undefined,
// ): boolean {
//   return (
//     Array.isArray(configA) &&
//     Array.isArray(configB) &&
//     configA.length === configB.length
//   );
// }

// function hasEqualConfiguration(
//   configA: SkyModalConfigurationInterface | Provider[] | undefined,
//   configB: SkyModalConfigurationInterface | Provider[] | undefined,
// ): boolean {
//   return (
//     isSkyModalConfigurationInterface(configA) &&
//     isSkyModalConfigurationInterface(configB) &&
//     Object.keys(configA).length === Object.keys(configB).length
//   );
// }

// function getMatches<T>(
//   modals: TestSubject[],
//   component: Type<T>,
//   config: SkyModalConfigurationInterface | Provider[] | undefined,
// ): TestSubject[] {
//   const matches: TestSubject[] = [];

//   for (const modal of modals) {
//     if (modal.component !== component) {
//       continue;
//     }

//     if (config === undefined && modal.config === undefined) {
//       matches.push(modal);
//       continue;
//     }

//     if (hasEqualProviders(modal.config, config)) {
//       matches.push(modal);
//       continue;
//     }

//     if (hasEqualConfiguration(modal.config, config)) {
//       matches.push(modal);
//     }
//   }

//   return matches;
// }

/**
 * @internal
 */
@Injectable()
export class SkyModalTestingService
  extends SkyModalTestingController
  implements OnDestroy, SkyModalServiceInterface
{
  readonly #modals: TestSubject[] = [];
  readonly #environmentInjector = inject(EnvironmentInjector);

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  public ngOnDestroy(): void {
    this.#modals.forEach(() => {
      this.closeTopmost();
    });
  }

  public closeTopmost(args?: SkyModalCloseArgs): void {
    const modal = this.#getTopmostModal();

    if (!modal) {
      throw new Error('Expected to close the topmost modal, but none exist.');
    }

    modal.instance.close(args);

    this.#modals.pop();
  }

  public count(): number {
    return this.#modals.length;
  }

  public expectNone(): void {
    if (this.#modals.length > 0) {
      throw new Error('Modals exist.');
    }
  }

  public expectTopmostOpen<T>(component: Type<T>): void {
    const topmostModal = this.#getTopmostModal();

    if (!topmostModal) {
      throw new Error('A modal was expected to be open but there are none.');
    }

    if (topmostModal.component !== component) {
      throw new Error(
        `Expected the topmost modal to include the component ${component.name}, but it uses ${topmostModal.component.name}.`,
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
      options.providers ?? [],
      this.#environmentInjector,
    );

    const componentRef = createComponent(component, {
      environmentInjector,
    });

    instance.componentRef = componentRef;
    instance.componentInstance = componentRef.instance;

    const modal: TestSubject = {
      component,
      config,
      instance,
    };

    this.#modals.push(modal);

    return instance;
  }

  #getTopmostModal(): TestSubject | undefined {
    return this.#modals.at(this.#modals.length - 1);
  }
}
