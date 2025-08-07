import { Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

import { ListPageContentComponent } from './list-page-content.component';

/**
 * @title List page with tabs layout using data manager
 * @docsDemoHidden
 */
@Component({
  selector: 'app-pages-page-list-page-tabs-layout-example',
  templateUrl: './example.component.html',
  imports: [ListPageContentComponent, SkyPageModule],
})
export class PagesPageListPageTabsLayoutExampleComponent {}
