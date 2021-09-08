import {
  Component,
  ComponentRef,
  ElementRef,
  ViewChild
} from '@angular/core';

import {
  SkyDynamicComponentLocation,
  SkyDynamicComponentService
} from '../../public/public_api';

import {
  DynamicComponentDemoExampleComponent
} from './dynamic-component-example.component';

@Component({
  selector: 'sky-dynamic-component-demo',
  templateUrl: './dynamic-component.component.html',
  styleUrls: ['./dynamic-component.component.scss']
})
export class DynamicComponentDemoComponent {
  private componentRefBodyBottom: ComponentRef<DynamicComponentDemoExampleComponent>;
  private componentRefBodyTop: ComponentRef<DynamicComponentDemoExampleComponent>;
  private componentRefElementBottom: ComponentRef<DynamicComponentDemoExampleComponent>;
  private componentRefElementTop: ComponentRef<DynamicComponentDemoExampleComponent>;

  @ViewChild('contentRef', { read: ElementRef })
  private contentRef: ElementRef;

  constructor(
    private dynamicComponentService: SkyDynamicComponentService
  ) { }

  public createComponentBottom(): void {
    if (this.componentRefBodyBottom) {
      return;
    }

    this.componentRefBodyBottom = this.dynamicComponentService.createComponent(
      DynamicComponentDemoExampleComponent,
      {
        location: SkyDynamicComponentLocation.BodyBottom
      }
    );

    this.componentRefBodyBottom.instance.sayHello();
  }

  public removeComponentBottom(): void {
    this.dynamicComponentService.removeComponent(this.componentRefBodyBottom);
    this.componentRefBodyBottom = undefined;
  }

  public createComponentTop(): void {
    if (this.componentRefBodyTop) {
      return;
    }

    this.componentRefBodyTop = this.dynamicComponentService.createComponent(
      DynamicComponentDemoExampleComponent,
      {
        location: SkyDynamicComponentLocation.BodyTop
      }
    );

    this.componentRefBodyTop.instance.sayHello();
  }

  public removeComponentTop(): void {
    this.dynamicComponentService.removeComponent(this.componentRefBodyTop);
    this.componentRefBodyTop = undefined;
  }

  public createComponentElementBottom(): void {
    if (this.componentRefElementBottom) {
      return;
    }

    this.componentRefElementBottom = this.dynamicComponentService.createComponent(
      DynamicComponentDemoExampleComponent,
      {
        location: SkyDynamicComponentLocation.ElementBottom,
        referenceEl: this.contentRef.nativeElement
      }
    );

    this.componentRefElementBottom.instance.sayHello();
  }

  public removeComponentElementBottom(): void {
    this.dynamicComponentService.removeComponent(this.componentRefElementBottom);
    this.componentRefElementBottom = undefined;
  }

  public createComponentElementTop(): void {
    if (this.componentRefElementTop) {
      return;
    }

    this.componentRefElementTop = this.dynamicComponentService.createComponent(
      DynamicComponentDemoExampleComponent,
      {
        location: SkyDynamicComponentLocation.ElementTop,
        referenceEl: this.contentRef.nativeElement
      }
    );

    this.componentRefElementTop.instance.sayHello();
  }

  public removeComponentElementTop(): void {
    this.dynamicComponentService.removeComponent(this.componentRefElementTop);
    this.componentRefElementTop = undefined;
  }
}
