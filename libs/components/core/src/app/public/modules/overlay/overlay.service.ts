import {
  ComponentRef,
  Injectable
} from '@angular/core';

import {
  SkyDynamicComponentService
} from '../dynamic-component';

import {
  SkyOverlayAdapterService
} from './overlay-adapter.service';

import {
  SkyOverlayConfig
} from './overlay-config';

import {
  SkyOverlayHostComponent
} from './overlay-host.component';

import {
  SkyOverlayInstance
} from './overlay-instance';

/**
 * This service is used to create new overlays.
 * @dynamic
 */
@Injectable()
export class SkyOverlayService {

  private static host: ComponentRef<SkyOverlayHostComponent>;

  private static overlays: SkyOverlayInstance[] = [];

  constructor(
    private dynamicComponentService: SkyDynamicComponentService,
    private adapter: SkyOverlayAdapterService
  ) { }

  /**
   * Creates an empty overlay. Use the returned `SkyOverlayInstance` to append content.
   * @param config Configuration for the overlay.
   */
  public create(config?: SkyOverlayConfig): SkyOverlayInstance {

    if (!SkyOverlayService.host) {
      this.createHostComponent();
    }

    const settings = this.prepareConfig(config);

    if (settings.enableScroll === false) {
      this.adapter.restrictBodyScroll();
    }

    const componentRef = SkyOverlayService.host.instance.createOverlay(settings);
    const instance = new SkyOverlayInstance(
      settings,
      componentRef
    );

    instance.closed.subscribe(() => {
      this.close(instance);
    });

    SkyOverlayService.overlays.push(instance);

    return instance;
  }

  /**
   * Closes (and destroys) an overlay instance.
   * @param instance The instance to close.
   */
  public close(instance: SkyOverlayInstance): void {
    this.destroyOverlay(instance);
    instance.componentRef.destroy();

    if (SkyOverlayService.overlays.length === 0) {
      this.removeHostComponent();
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

  private createHostComponent(): void {
    SkyOverlayService.host = this.dynamicComponentService.createComponent(SkyOverlayHostComponent);
  }

  private removeHostComponent(): void {
    this.dynamicComponentService.removeComponent(SkyOverlayService.host);
    SkyOverlayService.host = undefined;
  }

  private prepareConfig(config: SkyOverlayConfig): SkyOverlayConfig {
    const defaults: SkyOverlayConfig = {
      closeOnNavigation: true,
      enableClose: false,
      enableScroll: true,
      showBackdrop: false
    };

    return {...defaults, ...config};
  }

  private destroyOverlay(instance: SkyOverlayInstance): void {
    SkyOverlayService.overlays.splice(SkyOverlayService.overlays.indexOf(instance), 1);

    if (instance.config.enableScroll === false) {
      // Only release the body scroll if no other overlay wishes it to be disabled.
      const anotherOverlayDisablesScroll = SkyOverlayService.overlays.some(o => !o.config.enableScroll);
      if (!anotherOverlayDisablesScroll) {
        this.adapter.releaseBodyScroll();
      }
    }
  }

}
