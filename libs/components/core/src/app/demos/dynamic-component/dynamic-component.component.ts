import {
  Component, OnInit
} from '@angular/core';

import {
  SkyDynamicComponentService, SkyDynamicComponentLocation
} from '../../public';
import { DynamicComponentDemoExampleComponent } from './dynamic-component-example.component';

@Component({
  selector: 'sky-dynamic-component-demo',
  template: ''
})
export class DynamicComponentDemoComponent implements OnInit {
  constructor(
    private dynamicComponentService: SkyDynamicComponentService
  ) { }

  public ngOnInit(): void {
    const componentRef = this.dynamicComponentService.createComponent(
      DynamicComponentDemoExampleComponent,
      {
        location: SkyDynamicComponentLocation.BodyBottom
      }
    );

    componentRef.instance.sayHello();
  }
}
