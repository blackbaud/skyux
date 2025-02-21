import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FontLoadingService } from '@skyux/storybook';

import { Observable, combineLatest, of } from 'rxjs';
import { delay, filter, first, map } from 'rxjs/operators';

@Component({
  selector: 'app-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss'],
  standalone: false,
})
export class ColorpickerComponent {
  readonly #fontLoadingService = inject(FontLoadingService);

  public colorForm: FormGroup;

  public swatches12: string[] = [
    '#333333',
    '#888888',
    '#EFEFEF',
    '#FFF',
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
    '#A1B1A7',
    '#68AFEF',
  ];

  public swatches6: string[] = [
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
  ];

  #pickerReady = of(true).pipe(delay(1200));
  public readonly ready: Observable<boolean>;

  constructor(formBuilder: FormBuilder) {
    this.colorForm = formBuilder.group({
      colorOne: new FormControl('#f00'),
      colorTwo: new FormControl('#ff0'),
      colorThree: new FormControl({ value: '#000', disabled: true }),
      colorFour: new FormControl('#00f'),
      colorFive: new FormControl('#00f', { validators: [Validators.required] }),
      colorSix: new FormControl('#00f'),
      colorSeven: new FormControl('#00f', {
        validators: [
          () => {
            return { intentionalError: true };
          },
        ],
      }),
      colorEight: new FormControl('#00f'),
    });

    this.ready = combineLatest([
      this.#pickerReady,
      this.#fontLoadingService.ready(true),
    ]).pipe(
      filter(([pickerReady, fontsLoaded]) => pickerReady && fontsLoaded),
      first(),
      map(() => true),
    );
  }
}
