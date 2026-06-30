import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

import { ListPageContentComponent } from './list-page-content.component';

/**
 * @title List page with list layout using data manager
 * @docsDemoHidden
 */
@Component({
  selector: 'app-pages-page-list-page-list-layout-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ListPageContentComponent, SkyPageModule],
})
export class PagesPageListPageListLayoutExampleComponent {}
