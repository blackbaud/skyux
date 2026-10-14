import { Component, input } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';

import { SkyInputBoxButton } from '../input-box-button';
import { SkyInputBoxModule } from '../input-box.module';

@Component({
  selector: 'sky-input-box-button-fixture',
  templateUrl: './input-box-button.component.fixture.html',
  imports: [ReactiveFormsModule, SkyInputBoxButton, SkyInputBoxModule],
})
export class InputBoxButtonFixtureComponent {
  public readonly inputType = input<'input' | 'textarea' | 'select'>('input');

  public readonly insetButton = input(false);

  public readonly leftButton = input(false);

  public readonly normalButtonLabels = input<string[]>(['Normal button']);

  public readonly control = new UntypedFormControl('', Validators.required);

  public readonly clickedLabels: string[] = [];
}
