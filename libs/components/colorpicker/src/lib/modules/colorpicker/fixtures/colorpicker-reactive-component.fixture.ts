import { Component, ViewChild } from '@angular/core';
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

@Component({
  selector: 'sky-colorpicker-fixture',
  templateUrl: './colorpicker-reactive-component.fixture.html',
  standalone: false,
})
export class ColorpickerReactiveTestComponent {
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
    (control: AbstractControl): ValidationErrors | null => {
      if (control.value?.rgba?.alpha < 0.8) {
        return { opaque: true };
      }

      return null;
    },
  ]);

  public colorControl2 = new UntypedFormControl('#00f', [
    (control: AbstractControl): ValidationErrors | null => {
      if (control.value?.rgba?.alpha < 0.8) {
        return { opaque: true };
      }

      return null;
    },
  ]);

  public colorForm = new UntypedFormGroup({
    colorModel: this.colorControl,
    colorModel2: this.colorControl2,
  });

  public sendMessage(type: SkyColorpickerMessageType) {
    this.colorpickerController.next({ type });
  }
}
