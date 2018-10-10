import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkySectionedFormComponent } from './sectioned-form.component';
import { SkySectionedFormSectionComponent } from './sectioned-form-section.component';
import { SkyVerticalTabsetModule } from '../vertical-tabset/vertical-tabset.module';

@NgModule({
  declarations: [
    SkySectionedFormComponent,
    SkySectionedFormSectionComponent
  ],
  imports: [
    CommonModule,
    SkyVerticalTabsetModule
  ],
  exports: [
    SkySectionedFormComponent,
    SkySectionedFormSectionComponent
  ]
})
export class SkySectionedFormModule { }
