import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormControl,
  ValidationErrors,
} from '@angular/forms';
import { SkyColorpickerModule, SkyColorpickerOutput } from '@skyux/colorpicker';
import { SkyIdModule } from '@skyux/core';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyColorpickerModule,
    SkyIdModule,
  ],
})
export class DemoComponent {
  protected formGroup: FormGroup;
  protected favoriteColor: UntypedFormControl;

  protected swatches: string[] = [
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
  ];

  constructor() {
    this.favoriteColor = new UntypedFormControl('#f00', [
      (control): ValidationErrors | null => {
        if (control.value?.rgba?.alpha < 0.8) {
          return { opaque: true };
        }

        return null;
      },
    ]);

    this.formGroup = inject(FormBuilder).group({
      favoriteColor: this.favoriteColor,
    });
  }

  protected onSelectedColorChanged(args: SkyColorpickerOutput): void {
    console.log('Reactive form color changed:', args);
  }

  protected submit(): void {
    const controlValue = this.formGroup.get('favoriteColor')?.value;
    const favoriteColor: string = controlValue.hex || controlValue;
    alert('Your favorite color is: \n' + favoriteColor);
  }
}
