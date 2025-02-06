import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyThemeModule } from '@skyux/theme';

import { SkyVerticalTabsetModule } from '../vertical-tabset/vertical-tabset.module';

import { SkySectionedFormSectionComponent } from './sectioned-form-section.component';
import { SkySectionedFormComponent } from './sectioned-form.component';

@NgModule({
  declarations: [SkySectionedFormComponent, SkySectionedFormSectionComponent],
  imports: [
    CommonModule,
    SkyCheckboxModule,
    SkyThemeModule,
    SkyVerticalTabsetModule,
  ],
  exports: [SkySectionedFormComponent, SkySectionedFormSectionComponent],
})
export class SkySectionedFormModule {}
