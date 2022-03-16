import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StacheNavModule } from '../nav/nav.module';
import { StacheResourcesModule } from '../shared/stache-resources.module';

import { StacheFooterComponent } from './footer.component';

@NgModule({
  imports: [CommonModule, StacheResourcesModule, StacheNavModule],
  declarations: [StacheFooterComponent],
  exports: [StacheFooterComponent],
})
export class StacheFooterModule {}
