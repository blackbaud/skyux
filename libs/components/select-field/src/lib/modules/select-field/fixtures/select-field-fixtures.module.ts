import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';

import { SkySelectFieldModule } from '../select-field.module';

import { SkySelectFieldTestComponent } from './select-field.component.fixture';

@NgModule({
  declarations: [SkySelectFieldTestComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterTestingModule,
    SkySelectFieldModule,
  ],
  exports: [SkySelectFieldTestComponent],
})
export class SkySelectFieldFixturesModule {}
