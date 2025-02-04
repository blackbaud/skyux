import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyInlineFormResourcesModule } from '../shared/sky-inline-form-resources.module';

import { SkyInlineFormComponent } from './inline-form.component';

@NgModule({
  declarations: [SkyInlineFormComponent],
  imports: [CommonModule, SkyInlineFormResourcesModule],
  exports: [SkyInlineFormComponent],
})
export class SkyInlineFormModule {}
