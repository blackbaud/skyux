import { Component } from '@angular/core';

import { StacheLayoutComponent } from '../layout.component';

@Component({
  selector: 'stache-layout-default',
  templateUrl: './layout-default.component.html'
})
export class StacheLayoutDefaultComponent extends StacheLayoutComponent {
  public constructor() {
    super();
  }
}
