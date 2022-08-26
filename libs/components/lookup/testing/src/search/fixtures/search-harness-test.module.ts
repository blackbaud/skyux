import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkySearchTestingModule } from '../search-testing.module';

import { SearchHarnessTestComponent } from './search-harness-test.component';

@NgModule({
  imports: [CommonModule, SkySearchTestingModule],
  declarations: [SearchHarnessTestComponent],
})
export class SearchHarnessTestModule {}
