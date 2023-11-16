import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  inject,
} from '@angular/core';

import {
  SkyDynamicComponentLegacyService,
  SkyDynamicComponentService,
} from '../dynamic-component/dynamic-component.service';

import { SkyOverlayAdapterService } from './overlay-adapter.service';
import { SkyOverlayConfig } from './overlay-config';
import { SkyOverlayContext } from './overlay-context';
import { SkyOverlayInstance } from './overlay-instance';
import { SkyOverlayComponent } from './overlay.component';

/**
 * This service is used to create new overlays.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyOverlayService {
  private static overlays: SkyOverlayInstance[] = [];

  readonly #adapter = inject(SkyOverlayAdapterService);
  readonly #applicationRef = inject(ApplicationRef);
  readonly #dynamicComponentSvc: SkyDynamicComponentService;
  readonly #environmentInjector = inject(EnvironmentInjector);

  constructor(dynamicComponentSvc: SkyDynamicComponentService) {
    this.#dynamicComponentSvc = dynamicComponentSvc;
  }

  /**
   * Creates an empty overlay. Use the returned `SkyOverlayInstance` to append content.
   * @param config Configuration for the overlay.
   */
  public create(config?: SkyOverlayConfig): SkyOverlayInstance {
    const settings = this.#prepareConfig(config);

    if (settings.enableScroll === false) {
      this.#adapter.restrictBodyScroll();
    }

    const componentRef = this.#createOverlay(settings);
    const instance = new SkyOverlayInstance(settings, componentRef);

    instance.closed.subscribe(() => {
      // Only execute the service's close method if the instance still exists.
      // This is needed to address a race condition if the deprecated instance.close method is used instead.
      if (SkyOverlayService.overlays.indexOf(instance) > -1) {
        this.close(instance);
      }
    });

    SkyOverlayService.overlays.push(instance);

    return instance;
  }

  /**
   * Closes (and destroys) an overlay instance.
   * @param instance The instance to close.
   */
  public close(instance: SkyOverlayInstance): void {
    this.#destroyOverlay(instance);
    this.#applicationRef.detachView(instance.componentRef.hostView);
    instance.componentRef.destroy();

    // In some cases, Angular keeps dynamically-generated component's nodes in the DOM during
    // unit tests. This can make querying difficult because the older DOM nodes still exist and
    // produce inconsistent results.
    // Angular Material's overlay appears to do the same thing:
    // https://github.com/angular/components/blob/master/src/cdk/portal/dom-portal-outlet.ts#L143-L145
    // (Ignoring coverage since this branch will only be hit by consumer unit tests.)
    const componentElement = instance.componentRef.location.nativeElement;
    /* istanbul ignore if */
    if (componentElement.parentNode !== null) {
      componentElement.parentNode.removeChild(componentElement);
    }
  }

  /**
   * Closes all overlay instances.
   */
  public closeAll(): void {
    // The `close` event handler for each instance alters the array's length asynchronously,
    // so the only "safe" index to call is zero.
    while (SkyOverlayService.overlays.length > 0) {
      this.close(SkyOverlayService.overlays[0]);
    }
  }

  #createOverlay(config: SkyOverlayConfig): ComponentRef<SkyOverlayComponent> {
    return this.#dynamicComponentSvc.createComponent(SkyOverlayComponent, {
      environmentInjector: this.#environmentInjector,
      providers: [
        {
          provide: SkyOverlayContext,
          useValue: new SkyOverlayContext(config),
        },
      ],
    });
  }

  #prepareConfig(config: SkyOverlayConfig = {}): SkyOverlayConfig {
    const defaults: SkyOverlayConfig = {
      closeOnNavigation: true,
      enableClose: false,
      enablePointerEvents: false,
      enableScroll: true,
      showBackdrop: false,
      wrapperClass: '',
    };

    return { ...defaults, ...config };
  }

  #destroyOverlay(instance: SkyOverlayInstance): void {
    SkyOverlayService.overlays.splice(
      SkyOverlayService.overlays.indexOf(instance),
      1,
    );

    if (instance.config.enableScroll === false) {
      // Only release the body scroll if no other overlay wishes it to be disabled.
      const anotherOverlayDisablesScroll = SkyOverlayService.overlays.some(
        (o) => !o.config.enableScroll,
      );
      if (!anotherOverlayDisablesScroll) {
        this.#adapter.releaseBodyScroll();
      }
    }
  }
}

/**
 * This service is used to create new overlays.
 * @internal
 * @deprecated Use `SkyOverlayService` to open a standalone component instead.
 */
@Injectable({
  providedIn: 'any',
})
export class SkyOverlayLegacyService extends SkyOverlayService {
  /* istanbul ignore next */
  constructor(dynamicComponentSvc: SkyDynamicComponentLegacyService) {
    super(dynamicComponentSvc);
  }
}
