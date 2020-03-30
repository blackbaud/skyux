import {
  Component
} from '@angular/core';

import {
  SkyOverlayConfig,
  SkyOverlayInstance,
  SkyOverlayService
} from '../../public';

import {
  OverlayDemoExampleContext
} from './overlay-demo-example-context';

import {
  OverlayDemoExampleComponent
} from './overlay-demo-example.component';

let uniqueId = 0;

@Component({
  selector: 'sky-overlay-demo',
  templateUrl: './overlay-demo.component.html'
})
export class OverlayDemoComponent {

  public overlays: SkyOverlayInstance[] = [];

  constructor(
    public overlayService: SkyOverlayService
  ) { }

  public onTestClick(): void {
    alert('Clicked! Is that a good thing?');
  }

  public launchDefaultOverlay(): void {
    this.createOverlay({});
  }

  public launchCustomOverlay(): void {
    this.createOverlay({
      closeOnNavigation: false,
      enableClose: true,
      enablePointerEvents: true,
      enableScroll: false,
      showBackdrop: true
    });
  }

  public closeAllOverlays(): void {
    this.overlayService.closeAll();
  }

  private createOverlay(config: SkyOverlayConfig): SkyOverlayInstance {
    const overlayInstance = this.overlayService.create(config);

    const componentInstance = overlayInstance.attachComponent(
      OverlayDemoExampleComponent,
      [{
        provide: OverlayDemoExampleContext,
        useValue: new OverlayDemoExampleContext(++uniqueId)
      }]
    );

    overlayInstance.backdropClick.subscribe(() => {
      console.log('Outside clicked.');
    });

    overlayInstance.closed.subscribe(() => {
      this.removeLocalInstance(overlayInstance);
    });

    // Manually close the overlay instance when a button is clicked in the attached component.
    componentInstance.closeClicked.subscribe(() => {
      this.overlayService.close(overlayInstance);
    });

    this.overlays.push(overlayInstance);

    return overlayInstance;
  }

  private removeLocalInstance(instance: SkyOverlayInstance): void {
    this.overlays.splice(this.overlays.indexOf(instance), 1);
  }
}
