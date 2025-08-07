import { Component } from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyAlertModule, SkyLabelModule } from '@skyux/indicators';
import { SkyPageModule } from '@skyux/pages';

import { RecordPageContentComponent } from './record-page-content.component';

/**
 * @title Record page with tabs layout using data manager
 * @docsDemoHidden
 */
@Component({
  selector: 'app-pages-page-record-page-tabs-layout-example',
  templateUrl: './example.component.html',
  imports: [
    RecordPageContentComponent,
    SkyAlertModule,
    SkyAvatarModule,
    SkyLabelModule,
    SkyPageModule,
  ],
})
export class PagesPageRecordPageTabsLayoutExampleComponent {}
