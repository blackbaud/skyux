import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkySectionedFormComponent } from './sectioned-form.component';
import { SkySectionedFormSectionComponent } from './sectioned-form-section.component';
import { SkyVerticalTabsetModule } from '../vertical-tabset/vertical-tabset.module';
import { SkyCheckboxModule } from '@skyux/forms';

@NgModule({
  declarations: [
    SkySectionedFormComponent,
    SkySectionedFormSectionComponent
  ],
  imports: [
    CommonModule,
    SkyCheckboxModule,
    SkyVerticalTabsetModule
  ],
  exports: [
    SkySectionedFormComponent,
    SkySectionedFormSectionComponent
  ]
})
export class SkySectionedFormModule { }
