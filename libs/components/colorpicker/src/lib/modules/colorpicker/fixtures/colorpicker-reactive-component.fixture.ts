import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Subject } from 'rxjs';

import { SkyColorpickerComponent } from '../colorpicker.component';
import { SkyColorpickerMessage } from '../types/colorpicker-message';
import { SkyColorpickerMessageType } from '../types/colorpicker-message-type';

/**
 * `SkyColorpickerInputDirective`'s `value` now emits a formatted string (per
 * `outputFormat`), not the internal `SkyColorpickerOutput` object, so this
 * fixture parses the alpha channel out of the `rgba(r,g,b,a)` string instead
 * of reading `control.value.rgba.alpha`.
 */
function isOpaque(rgbaText: string | undefined): ValidationErrors | null {
  const alphaMatch = /,([\d.]+)\)$/.exec(rgbaText ?? '');
  const alpha = alphaMatch ? Number(alphaMatch[1]) : 1;

  return alpha < 0.8 ? { opaque: true } : null;
}

@Component({
  selector: 'sky-colorpicker-fixture',
  templateUrl: './colorpicker-reactive-component.fixture.html',
  standalone: false,
})
export class ColorpickerReactiveTestComponent {
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  public selectedHexType = 'hex6';
  public initialColor: string | undefined = '#2889e5';
  public selectedOutputFormat = 'rgba';
  public presetColors = [
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
  public inputType = 'text';
  public labelText: string | undefined;

  public set required(value: boolean) {
    if (value) {
      this.colorControl.addValidators([Validators.required]);
    } else {
      this.colorControl.removeValidators([Validators.required]);
    }
    this.colorControl.updateValueAndValidity();
  }

  @ViewChild('colorPickerTest', {
    static: true,
  })
  public colorpickerComponent!: SkyColorpickerComponent;
  public colorpickerController = new Subject<SkyColorpickerMessage>();

  public newValues = {
    colorModel: '#000',
    colorModel2: '#000',
  };

  public colorControl = new UntypedFormControl('#00f', [
    (control: AbstractControl): ValidationErrors | null =>
      isOpaque(control.value),
  ]);

  public colorControl2 = new UntypedFormControl('#00f', [
    (control: AbstractControl): ValidationErrors | null =>
      isOpaque(control.value),
  ]);

  public colorForm = new UntypedFormGroup({
    colorModel: this.colorControl,
    colorModel2: this.colorControl2,
  });

  public sendMessage(type: SkyColorpickerMessageType) {
    this.colorpickerController.next({ type });
    this.#changeDetectorRef.markForCheck();
  }
}
