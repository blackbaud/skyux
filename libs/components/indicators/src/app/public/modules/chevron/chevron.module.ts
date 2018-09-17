import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyChevronComponent } from './chevron.component';
import { SkyResourcesModule } from '../resources';

@NgModule({
  declarations: [SkyChevronComponent],
  imports: [CommonModule, SkyResourcesModule],
  exports: [SkyChevronComponent]
})
export class SkyChevronModule { }
