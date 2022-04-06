import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyCardModule, SkyToolbarModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyModalModule } from '@skyux/modals';

import { DataManagerFiltersModalDemoComponent } from './data-filter-modal.component';
import { DataManagerDemoComponent } from './data-manager-demo.component';
import { DataViewCardsDemoComponent } from './data-view-cards.component';
import { DataViewRepeaterDemoComponent } from './data-view-repeater.component';

@NgModule({
  declarations: [
    DataManagerDemoComponent,
    DataManagerFiltersModalDemoComponent,
    DataViewCardsDemoComponent,
    DataViewRepeaterDemoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyCardModule,
    SkyCheckboxModule,
    SkyDataManagerModule,
    SkyModalModule,
    SkyRepeaterModule,
    SkyToolbarModule,
  ],
  exports: [DataManagerDemoComponent],
  entryComponents: [
    DataManagerDemoComponent,
    DataManagerFiltersModalDemoComponent,
  ],
})
export class DataManagerDemoModule {}
