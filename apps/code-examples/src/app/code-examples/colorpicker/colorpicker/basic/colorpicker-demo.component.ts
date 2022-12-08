import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { SkyColorpickerOutput } from '@skyux/colorpicker';

@Component({
  selector: 'app-colorpicker-demo',
  templateUrl: './colorpicker-demo.component.html',
})
export class ColorpickerDemoComponent {
  public reactiveForm: UntypedFormGroup;

  public swatches: string[] = [
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
  ];

  constructor(private formBuilder: UntypedFormBuilder) {
    this.reactiveForm = this.formBuilder.group({
      favoriteColor: new UntypedFormControl('#f00'),
    });
  }

  public onSelectedColorChanged(args: SkyColorpickerOutput): void {
    console.log('Reactive form color changed:', args);
  }

  public submit(): void {
    const controlValue = this.reactiveForm?.get('favoriteColor')?.value;
    const favoriteColor: string = controlValue.hex || controlValue;
    alert('Your favorite color is: \n' + favoriteColor);
  }
}
