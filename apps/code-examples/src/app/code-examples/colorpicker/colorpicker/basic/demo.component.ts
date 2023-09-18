import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyColorpickerModule, SkyColorpickerOutput } from '@skyux/colorpicker';
import { SkyIdModule } from '@skyux/core';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [ReactiveFormsModule, SkyColorpickerModule, SkyIdModule],
})
export class DemoComponent {
  protected formGroup: FormGroup;

  protected swatches: string[] = [
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
  ];

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      favoriteColor: new FormControl('#f00'),
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
