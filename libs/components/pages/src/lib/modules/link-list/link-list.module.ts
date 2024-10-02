import { NgModule } from '@angular/core';

import { SkyLinkListItemComponent } from './link-list-item.component';
import { SkyLinkListComponent } from './link-list.component';

@NgModule({
  exports: [SkyLinkListComponent, SkyLinkListItemComponent],
  imports: [SkyLinkListComponent, SkyLinkListItemComponent],
})
export class SkyLinkListModule {}
