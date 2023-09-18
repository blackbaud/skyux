import { Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

import { RecordPageContentComponent } from './record-page-content.component';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [RecordPageContentComponent, SkyPageModule],
})
export class DemoComponent {}
