import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
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
  public formErrors: SkySummaryActionBarError[] = [];
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

  constructor() {
    this.donationSummary.statusChanges.subscribe(() => {
      if (this.donationSummary.errors) {
        const errors = this.donationSummary.errors;
        this.formErrors = [];
        Object.keys(errors).forEach((error) => {
          this.formErrors.push({
            message: errors[error] as string,
          });
        });
      }
    });
  }

  public onPrimaryActionClick(): void {
    alert('The primary action button was clicked.');
  }

  protected singleError(): void {
    this.donationSummary.setErrors({
      singleError: 'There is an error.',
    });
  }

  protected multipleErrors(): void {
    this.donationSummary.setErrors({
      firstError: 'There is an error.',
      secondError: 'There is another error.',
    });
  }
}
