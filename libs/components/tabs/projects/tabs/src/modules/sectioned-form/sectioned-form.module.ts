import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkySectionedFormComponent } from './sectioned-form.component';
import { SkySectionedFormSectionComponent } from './sectioned-form-section.component';
import { SkyThemeModule } from '@skyux/theme';
import { SkyVerticalTabsetModule } from '../vertical-tabset/vertical-tabset.module';
import { SkyCheckboxModule } from '@skyux/forms';

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
