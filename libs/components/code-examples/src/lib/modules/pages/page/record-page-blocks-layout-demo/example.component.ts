import { Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

import { RecordPageContentComponent } from './record-page-content.component';

/**
 * @title Boxes in a page component with a blocks layout
 */
@Component({
  selector: 'app-pages-page-record-page-blocks-layout-example',
  templateUrl: './example.component.html',
  imports: [RecordPageContentComponent, SkyPageModule],
})
export class PagesPageRecordPageBlocksLayoutExampleComponent {
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
