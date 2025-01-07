import { Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

import { ListPageContentComponent } from './list-page-content.component';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [ListPageContentComponent, SkyPageModule],
})
export class DemoComponent {}
