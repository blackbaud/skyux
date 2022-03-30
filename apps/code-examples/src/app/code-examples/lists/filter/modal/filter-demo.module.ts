import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyFilterModule, SkyRepeaterModule } from '@skyux/lists';
import { SkyModalModule } from '@skyux/modals';

import { FilterDemoModalComponent } from './filter-demo-modal.component';
import { FilterDemoComponent } from './filter-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyIdModule,
    SkyCheckboxModule,
    SkyFilterModule,
    SkyModalModule,
    SkyRepeaterModule,
    SkyToolbarModule,
  ],
  declarations: [FilterDemoComponent, FilterDemoModalComponent],
  exports: [FilterDemoComponent],
})
export class FilterDemoModule {}
