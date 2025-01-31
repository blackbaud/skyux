import { NgModule } from '@angular/core';

import { SkyLinkListRecentlyAccessedComponent } from '../link-list-recently-accessed/link-list-recently-accessed.component';

import { SkyLinkListItemComponent } from './link-list-item.component';
import { SkyLinkListComponent } from './link-list.component';

/**
 * @docsIncludeIds SkyLinkListComponent, SkyLinkListItemComponent, SkyLinkListHarness, SkyLinkListHarnessFilters, SkyLinkListItemHarness, SkyLinkListItemHarnessFilters
 */
@NgModule({
  exports: [
    SkyLinkListComponent,
    SkyLinkListItemComponent,
    SkyLinkListRecentlyAccessedComponent,
  ],
  imports: [
    SkyLinkListComponent,
    SkyLinkListItemComponent,
    SkyLinkListRecentlyAccessedComponent,
  ],
})
export class SkyLinkListModule {}
