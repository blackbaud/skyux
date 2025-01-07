import { Component } from '@angular/core';
import { SkyAlertModule } from '@skyux/indicators';
import { SkyPageModule } from '@skyux/pages';

import { SplitViewPageContentComponent } from './split-view-page-content.component';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyAlertModule, SkyPageModule, SplitViewPageContentComponent],
})
export class DemoComponent {}
