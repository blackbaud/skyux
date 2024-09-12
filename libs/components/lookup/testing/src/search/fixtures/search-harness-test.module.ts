import { NgModule } from '@angular/core';

import { SkySearchTestingModule } from '../search-testing.module';

import { SearchHarnessTestComponent } from './search-harness-test.component';

@NgModule({
  imports: [SkySearchTestingModule],
  declarations: [SearchHarnessTestComponent],
})
export class SearchHarnessTestModule {}
