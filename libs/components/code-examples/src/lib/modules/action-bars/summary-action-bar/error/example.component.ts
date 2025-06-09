import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  SkySummaryActionBarError,
  SkySummaryActionBarModule,
} from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';

import { of, switchMap } from 'rxjs';

interface donationSummary {
  value: number;
  label: string;
}

/**
 * @title Summary action bar with errors
 * @docsDemoHidden
 */
@Component({
  selector: 'app-action-bars-summary-action-bar-error-example',
  templateUrl: './example.component.html',
  imports: [SkyKeyInfoModule, SkySummaryActionBarModule, ReactiveFormsModule],
})
export class ActionBarsSummaryActionBarErrorExampleComponent {
  protected donationSummary = new FormControl<donationSummary[] | null>([
    {
      value: 250,
      label: 'Given this month',
    },
    {
      value: 1000,
      label: 'Given this year',
    },
    {
      value: 1300,
      label: 'Given all time',
    },
  ]);
  protected exampleForm = inject(FormBuilder).group({
    donationSummary: this.donationSummary,
  });

  protected formErrors = toSignal<SkySummaryActionBarError[] | undefined>(
    this.donationSummary.statusChanges.pipe(
      switchMap(() => {
        const errors = this.donationSummary.errors;

        return of(
          errors
            ? Object.values(errors).map((error) => ({
                message: error as string,
              }))
            : undefined,
        );
      }),
    ),
  );

  protected onPrimaryActionClick(): void {
    alert('Primary action button clicked.');
  }

  protected singleError(): void {
    this.donationSummary.setErrors({
      singleError: 'Monthly donation is missing.',
    });
  }

  protected multipleErrors(): void {
    this.donationSummary.setErrors({
      firstError: 'Monthly donation is missing.',
      secondError: 'Yearly donation is missing.',
    });
  }
}
