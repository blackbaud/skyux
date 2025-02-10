import { NgModule } from '@angular/core';

import { SkyLinkListRecentlyAccessedComponent } from '../link-list-recently-accessed/link-list-recently-accessed.component';
import { SkyLinkListItemComponent } from '../link-list/link-list-item.component';
import { SkyLinkListComponent } from '../link-list/link-list.component';
import { SkyLinkListModule } from '../link-list/link-list.module';
import { SkyModalLinkListModule } from '../modal-link-list/modal-link-list.module';
import { SkyPageHeaderModule } from '../page-header/page-header.module';

import { SkyPageContentComponent } from './page-content.component';
import { SkyPageLinksComponent } from './page-links.component';
import { SkyPageComponent } from './page.component';

@NgModule({
  declarations: [SkyPageComponent, SkyPageContentComponent],
  imports: [
    SkyLinkListModule,
    SkyPageLinksComponent,
    SkyLinkListComponent,
    SkyLinkListItemComponent,
    SkyLinkListRecentlyAccessedComponent,
    SkyModalLinkListModule,
  ],
  exports: [
    SkyLinkListComponent,
    SkyLinkListItemComponent,
    SkyLinkListRecentlyAccessedComponent,
    SkyLinkListModule,
    SkyModalLinkListModule,
    SkyPageComponent,
    SkyPageHeaderModule,
    SkyPageContentComponent,
    SkyPageLinksComponent,
  ],
})
export class SkyPageModule {}
