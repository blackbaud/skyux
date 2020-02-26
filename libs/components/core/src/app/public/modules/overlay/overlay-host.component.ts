import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {
  SkyOverlayComponent
} from './overlay.component';

import {
  SkyOverlayConfig
} from './overlay-config';

import {
  SkyOverlayContext
} from './overlay-context';

/**
 * @internal
 */
@Component({
  selector: 'sky-overlay-host',
  templateUrl: './overlay-host.component.html',
  styleUrls: ['./overlay-host.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyOverlayHostComponent {

  @ViewChild('target', { read: ViewContainerRef })
  private targetRef: ViewContainerRef;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) { }

  public createOverlay(config?: SkyOverlayConfig): ComponentRef<SkyOverlayComponent> {
    const injector = Injector.create({
      parent: this.injector,
      providers: [{
        provide: SkyOverlayContext,
        useValue: new SkyOverlayContext(config)
      }]
    });

    const factory = this.resolver.resolveComponentFactory(SkyOverlayComponent);
    const componentRef = this.targetRef.createComponent(factory, undefined, injector);

    this.changeDetector.markForCheck();

    return componentRef;
  }
}
