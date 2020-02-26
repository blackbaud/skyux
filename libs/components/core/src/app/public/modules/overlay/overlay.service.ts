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
 */
@Injectable()
export class SkyOverlayService {

  private host: ComponentRef<SkyOverlayHostComponent>;

  private overlays: SkyOverlayInstance[] = [];

  constructor(
    private dynamicComponentService: SkyDynamicComponentService,
    private adapter: SkyOverlayAdapterService
  ) {
    this.createHostComponent();
  }

  /**
   * Creates an empty overlay. Use the returned `SkyOverlayInstance` to append content.
   * @param config Configuration for the overlay.
   */
  public create(config?: SkyOverlayConfig): SkyOverlayInstance {
    const settings = this.prepareConfig(config);

    if (settings.enableScroll === false) {
      this.adapter.restrictBodyScroll();
    }

    const componentRef = this.host.instance.createOverlay(settings);
    const instance = new SkyOverlayInstance(
      settings,
      componentRef
    );

    instance.closed.subscribe(() => {
      this.destroyOverlay(instance);
      componentRef.destroy();
    });

    this.overlays.push(instance);

    return instance;
  }

  public closeAll(): void {
    // The `close` event handler for each instance alters the array's length asynchronously,
    // so the only "safe" index to call is zero.
    while (this.overlays.length > 0) {
      this.overlays[0].close();
    }
  }

  private createHostComponent(): void {
    this.host = this.dynamicComponentService.createComponent(SkyOverlayHostComponent);
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
    this.overlays.splice(this.overlays.indexOf(instance), 1);

    if (instance.config.enableScroll === false) {
      // Only release the body scroll if no other overlay wishes it to be disabled.
      const anotherOverlayDisablesScroll = this.overlays.some(o => !o.config.enableScroll);
      if (!anotherOverlayDisablesScroll) {
        this.adapter.releaseBodyScroll();
      }
    }
  }

}
