import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyPageModule, SkyRecentLink } from '@skyux/pages';

import { HomePageContentComponent } from './home-page-content.component';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [HomePageContentComponent, SkyIconModule, SkyPageModule],
})
export class DemoComponent {
  protected readonly recentLinks: SkyRecentLink[] = [
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
