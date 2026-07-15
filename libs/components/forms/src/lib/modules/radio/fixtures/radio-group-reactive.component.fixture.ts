import {
  Component,
  OnInit,
  ViewChild,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
} from '@angular/forms';

import { SkyRadioGroupComponent } from '../radio-group.component';
import { SkyRadioGroupHeadingLevel } from '../types/radio-group-heading-level';
import { SkyRadioGroupHeadingStyle } from '../types/radio-group-heading-style';

@Component({
  templateUrl: './radio-group-reactive.component.fixture.html',
  standalone: false,
})
export class SkyRadioGroupReactiveFixtureComponent implements OnInit {
  public ariaLabel = input<string | undefined>(undefined);

  public ariaLabelledBy = input<string | undefined>('radio-group-label');

  public groupName = input<string | undefined>('radioGroup');

  public initialDisabled = false;

  public initialValue: unknown = null;

  public options = signal<{ name: string; disabled: boolean; id?: string }[]>([
    { name: 'Lilly Corr', disabled: false },
    { name: 'Sherry Ken', disabled: false },
    { name: 'Harry Mckenzie', disabled: false },
    { name: 'Incorrect option', disabled: false },
  ]);

  public radioControl: UntypedFormControl | undefined;
  public radioForm: UntypedFormGroup | undefined;

  public required = input(false);

  public showRadioGroup = input(true);

  public tabIndex = input<number | undefined>(undefined);

  public headingText = input<string | undefined>(undefined);

  public headingHidden = input(false);

  public hintText = input<string | undefined>(undefined);

  public stacked = input<boolean | undefined>(undefined);

  public helpKey = input<string | undefined>(undefined);

  public helpPopoverContent = input<string | undefined>(undefined);

  public headingLevel = input<SkyRadioGroupHeadingLevel | undefined>(3);

  public headingStyle = input<SkyRadioGroupHeadingStyle | undefined>(3);

  @ViewChild(SkyRadioGroupComponent)
  public radioGroupComponent: SkyRadioGroupComponent | undefined;

  readonly #formBuilder = inject(UntypedFormBuilder);

  public ngOnInit(): void {
    this.radioControl = new UntypedFormControl(
      {
        value: this.initialValue,
        disabled: this.initialDisabled,
      },
      [
        (control: AbstractControl): ValidationErrors | null => {
          if (control.value?.name === 'Incorrect option') {
            return { incorrectOption: true };
          }
          return null;
        },
      ],
    );

    this.radioForm = this.#formBuilder.group({
      radioGroup: this.radioControl,
    });
  }

  public changeOptions(): void {
    this.options.set([
      { name: 'Lily Corr', disabled: false },
      { name: 'Hank Smith', disabled: false },
      { name: 'Sherry Ken', disabled: false },
      { name: 'Harry Mckenzie', disabled: false },
    ]);
  }
}
