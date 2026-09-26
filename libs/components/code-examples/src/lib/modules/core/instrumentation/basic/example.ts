import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SkyInstrumentationContext } from '@skyux/core';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';

/**
 * @title Instrumentation context with basic setup
 */
@Component({
  imports: [
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyInputBoxModule,
    SkyInstrumentationContext,
  ],
  selector: 'app-core-instrumentation-basic-example',
  templateUrl: './example.html',
})
export class CoreInstrumentationBasicExample {
  protected formGroup = inject(FormBuilder).group({
    amount: '',
    repeatMonthly: false,
  });
}
