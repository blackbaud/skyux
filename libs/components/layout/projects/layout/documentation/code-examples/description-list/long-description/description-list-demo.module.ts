import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyDescriptionListModule } from 'projects/layout/src/public-api';

import { DescriptionListDemoComponent } from './description-list-demo.component';

@NgModule({
  imports: [CommonModule, SkyDescriptionListModule],
  declarations: [DescriptionListDemoComponent],
  exports: [DescriptionListDemoComponent],
})
export class DescriptionListDemoModule {}
