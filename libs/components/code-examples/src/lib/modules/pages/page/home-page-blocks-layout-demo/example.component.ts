import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyPageModule, SkyRecentLink } from '@skyux/pages';

import { HomePageContentComponent } from './home-page-content.component';

/**
 * @title Home page with blocks layout, using tile dashboard and recently accessed links
 * @docsDemoHidden
 */
@Component({
  selector: 'app-pages-page-home-page-blocks-layout-example',
  templateUrl: './example.component.html',
  imports: [HomePageContentComponent, SkyIconModule, SkyPageModule],
})
export class PagesPageHomePageBlocksLayoutExampleComponent {
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
