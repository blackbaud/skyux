import {
  Component,
  ComponentRef
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
  templateUrl: './dynamic-component.component.html'
})
export class DynamicComponentDemoComponent {
  private componentRef: ComponentRef<DynamicComponentDemoExampleComponent>;

  constructor(
    private dynamicComponentService: SkyDynamicComponentService
  ) { }

  public createComponent(): void {
    if (this.componentRef) {
      return;
    }

    this.componentRef = this.dynamicComponentService.createComponent(
      DynamicComponentDemoExampleComponent,
      {
        location: SkyDynamicComponentLocation.BodyBottom
      }
    );

    this.componentRef.instance.sayHello();
  }

  public removeComponent(): void {
    this.dynamicComponentService.removeComponent(this.componentRef);
    this.componentRef = undefined;
  }
}
