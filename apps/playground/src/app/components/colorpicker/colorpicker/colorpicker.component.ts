import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SkyColorpickerOutput } from '@skyux/colorpicker';

@Component({
  selector: 'app-colorpicker-demo',
  templateUrl: './colorpicker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ColorpickerComponent {
  public reactiveForm: UntypedFormGroup;
  public favoriteColor: UntypedFormControl;

  public swatches: string[] = [
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
  ];

  #required = false;

  constructor(formBuilder: UntypedFormBuilder) {
    this.favoriteColor = new UntypedFormControl('#f00', [
      (control: AbstractControl): ValidationErrors | null => {
        if (control.value?.rgba?.alpha < 0.8) {
          return { opaque: true };
        }

        return null;
      },
    ]);

    this.reactiveForm = formBuilder.group({
      favoriteColor: this.favoriteColor,
    });
  }

  public onSelectedColorChanged(args: SkyColorpickerOutput): void {
    console.log('Reactive form color changed:', args);
    // this.reactiveForm.setValue({ favoriteColor: args });
  }

  public submit(): void {
    const controlValue = this.reactiveForm.get('favoriteColor')?.value;
    const favoriteColor: string = controlValue.hex || controlValue;
    alert('Your favorite color is: \n' + favoriteColor);
  }

  public toggleRequired(): void {
    this.#required = !this.#required;

    if (this.#required) {
      this.favoriteColor.addValidators([Validators.required]);
    } else {
      this.favoriteColor.removeValidators([Validators.required]);
    }
    this.favoriteColor.updateValueAndValidity();
  }
}
