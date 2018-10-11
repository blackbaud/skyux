import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyDefinitionListModule } from '../';
import { SkyDefinitionListTestComponent } from './definition-list.component.fixture';

@NgModule({
  declarations: [
    SkyDefinitionListTestComponent
  ],
  imports: [
    CommonModule,
    SkyDefinitionListModule
  ],
  exports: [
    SkyDefinitionListTestComponent
  ]
})
export class SkyDefinitionListFixturesModule { }
