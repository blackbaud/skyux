import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  SkySummaryActionBarError,
  SkySummaryActionBarModule,
} from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';

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
  public donationSummary = new FormControl<donationSummary[] | null>([
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
  public exampleForm = inject(FormBuilder).group({
    donationSummary: this.donationSummary,
  });

  public valueChanged = toSignal(
    this.donationSummary.valueChanges.pipe(takeUntilDestroyed()),
  );

  public formErrors = computed(() => {
    console.log('Value changed:', this.valueChanged());
    const errorMessages: SkySummaryActionBarError[] = [];
    if (this.donationSummary.errors) {
      const errors = this.donationSummary.errors;
      Object.keys(errors).forEach((error) => {
        errorMessages.push({
          message: errors[error] as string,
        });
      });
    }
    return errorMessages;
  });

  public onPrimaryActionClick(): void {
    this.donationSummary.setValue([
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

    this.donationSummary.setErrors([]);
  }

  protected singleError(): void {
    this.donationSummary.setValue([
      {
        value: 1000,
        label: 'Given this year',
      },
      {
        value: 1300,
        label: 'Given all time',
      },
    ]);
    this.donationSummary.setErrors({
      singleError: 'Monthly donation is missing.',
    });
  }

  protected multipleErrors(): void {
    this.donationSummary.setValue([
      {
        value: 1300,
        label: 'Given all time',
      },
    ]);
    this.donationSummary.setErrors({
      firstError: 'Monthly donation is missing.',
      secondError: 'Yearly donation is missing.',
    });
  }
}
