import { Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

import { RecordPageContentComponent } from './record-page-content.component';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [RecordPageContentComponent, SkyPageModule],
})
export class DemoComponent {
  protected readonly recentLinks = [
    {
      label: 'Gift Management',
      permalink: { url: '' },
      lastAccessed: new Date(2024, 1, 1),
    },
    {
      label: 'Reporting',
      permalink: { url: '' },
      lastAccessed: new Date(2024, 1, 2),
    },
  ];
}
