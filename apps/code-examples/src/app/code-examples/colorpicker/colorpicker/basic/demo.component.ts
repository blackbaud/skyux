import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { SkyColorpickerModule, SkyColorpickerOutput } from '@skyux/colorpicker';

interface DemoForm {
  favoriteColor: FormControl<SkyColorpickerOutput | string>;
}

function isColorpickerOutput(value: unknown): value is SkyColorpickerOutput {
  return !!(value && typeof value === 'object' && 'rgba' in value);
}

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [ReactiveFormsModule, SkyColorpickerModule],
})
export class DemoComponent {
  protected favoriteColor: FormControl<SkyColorpickerOutput | string>;
  protected formGroup: FormGroup<DemoForm>;

  protected swatches: string[] = [
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
  ];

  constructor() {
    this.favoriteColor = new FormControl('#f00', {
      nonNullable: true,
      validators: [
        (control): ValidationErrors | null => {
          return isColorpickerOutput(control.value) &&
            control.value.rgba.alpha < 0.8
            ? { opaque: true }
            : null;
        },
      ],
    });

    this.formGroup = inject(FormBuilder).group<DemoForm>({
      favoriteColor: this.favoriteColor,
    });
  }

  protected onSelectedColorChanged(args: SkyColorpickerOutput): void {
    console.log('Reactive form color changed:', args);
  }

  protected submit(): void {
    const controlValue = this.favoriteColor.value;
    const favoriteColor = isColorpickerOutput(controlValue)
      ? controlValue.hex
      : controlValue;

    alert('Your favorite color is: \n' + favoriteColor);
  }
}
