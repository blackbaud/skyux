import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyFilterModule, SkyRepeaterModule } from '@skyux/lists';

import { FilterDemoComponent } from './filter-demo.component';

@NgModule({
  imports: [CommonModule, SkyFilterModule, SkyRepeaterModule, SkyToolbarModule],
  declarations: [FilterDemoComponent],
  exports: [FilterDemoComponent],
})
export class FilterDemoModule {}
