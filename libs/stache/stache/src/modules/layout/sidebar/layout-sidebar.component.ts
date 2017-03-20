import { Component } from '@angular/core';

import { StacheLayoutComponent } from '../layout.component';

@Component({
  selector: 'stache-layout-sidebar',
  templateUrl: './layout-sidebar.component.html'
})
export class StacheLayoutSidebarComponent extends StacheLayoutComponent {
  public constructor() {
    super();
  }
}
