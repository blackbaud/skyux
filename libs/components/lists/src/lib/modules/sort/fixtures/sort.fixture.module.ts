import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkySortModule } from '../sort.module';

import { SortTestComponent } from './sort.component.fixture';

@NgModule({
  declarations: [SortTestComponent],
  imports: [CommonModule, SkySortModule],
})
export class SkySortFixtureModule {}
