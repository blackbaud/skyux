import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkyDatepickerModule } from '../../datepicker.module';
import { SkyFuzzyDateService } from '../fuzzy-date.service';

import { FuzzyDatepickerNoFormatTestComponent } from './fuzzy-datepicker-no-format.component.fixture';
import { FuzzyDatepickerReactiveTestComponent } from './fuzzy-datepicker-reactive.component.fixture';
import { FuzzyDatepickerTestComponent } from './fuzzy-datepicker.component.fixture';

@NgModule({
  declarations: [
    FuzzyDatepickerNoFormatTestComponent,
    FuzzyDatepickerReactiveTestComponent,
    FuzzyDatepickerTestComponent,
  ],
  imports: [
    SkyDatepickerModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [SkyFuzzyDateService],
  exports: [
    FuzzyDatepickerNoFormatTestComponent,
    FuzzyDatepickerReactiveTestComponent,
    FuzzyDatepickerTestComponent,
  ],
})
export class FuzzyDatepickerTestModule {}
