import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyLinkListItemComponent } from '../link-list/link-list-item.component';
import { SkyLinkListComponent } from '../link-list/link-list.component';
import { SkyPageHeaderModule } from '../page-header/page-header.module';

import { SkyPageContentComponent } from './page-content.component';
import { SkyPageLinksComponent } from './page-links.component';
import { SkyPageComponent } from './page.component';

@NgModule({
  declarations: [SkyPageComponent, SkyPageContentComponent],
  imports: [
    CommonModule,
    SkyPageLinksComponent,
    SkyLinkListComponent,
    SkyLinkListItemComponent,
    SkyPageLinksComponent,
  ],
  exports: [
    SkyLinkListComponent,
    SkyLinkListItemComponent,
    SkyPageComponent,
    SkyPageHeaderModule,
    SkyPageContentComponent,
    SkyPageLinksComponent,
  ],
})
export class SkyPageModule {}
