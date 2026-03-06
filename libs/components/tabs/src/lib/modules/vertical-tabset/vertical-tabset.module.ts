import { NgModule } from '@angular/core';

import { SkyVerticalTabComponent } from './vertical-tab.component';
import { SkyVerticalTabsetAdapterService } from './vertical-tabset-adapter.service';
import { SkyVerticalTabsetGroupComponent } from './vertical-tabset-group.component';
import { SkyVerticalTabsetComponent } from './vertical-tabset.component';

@NgModule({
  imports: [
    SkyVerticalTabsetComponent,
    SkyVerticalTabsetGroupComponent,
    SkyVerticalTabComponent,
  ],
  providers: [SkyVerticalTabsetAdapterService],
  exports: [
    SkyVerticalTabsetComponent,
    SkyVerticalTabsetGroupComponent,
    SkyVerticalTabComponent,
  ],
})
export class SkyVerticalTabsetModule {}
