import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SkyDatepickerModule } from '../datepicker.module';
import { FuzzyDatepickerNoFormatTestComponent } from '../fuzzy/fixtures/fuzzy-datepicker-no-format.component.fixture';
import { FuzzyDatepickerReactiveTestComponent } from '../fuzzy/fixtures/fuzzy-datepicker-reactive.component.fixture';
import { FuzzyDatepickerTestComponent } from '../fuzzy/fixtures/fuzzy-datepicker.component.fixture';
import { SkyFuzzyDateService } from '../fuzzy/fuzzy-date.service';

@NgModule({
  declarations: [
    FuzzyDatepickerNoFormatTestComponent,
    FuzzyDatepickerReactiveTestComponent,
    FuzzyDatepickerTestComponent],
  imports: [
    SkyDatepickerModule,
    FormsModule,
    ReactiveFormsModule],
  providers: [SkyFuzzyDateService],
  exports: [
    FuzzyDatepickerNoFormatTestComponent,
    FuzzyDatepickerReactiveTestComponent,
    FuzzyDatepickerTestComponent],
})
export class FuzzyDatepickerTestModule {}
