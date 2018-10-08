import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { SkyLookupModule } from '../lookup.module';
import { SkyLookupTestComponent } from './lookup.component.fixture';

@NgModule({
  declarations: [
    SkyLookupTestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyLookupModule
  ],
  exports: [
    SkyLookupTestComponent
  ]
})
export class SkyLookupFixturesModule { }
