import { Component } from '@angular/core';
import { SkyAlertModule } from '@skyux/indicators';
import { SkyPageModule } from '@skyux/pages';

import { SplitViewPageContentComponent } from './split-view-page-content.component';

/**
 * @title Split view page with fit layout
 * @docsDemoHidden
 */
@Component({
  selector: 'app-pages-page-split-view-page-fit-layout-example',
  templateUrl: './example.component.html',
  imports: [SkyAlertModule, SkyPageModule, SplitViewPageContentComponent],
})
export class PagesPageSplitViewPageFitLayoutExampleComponent {}
