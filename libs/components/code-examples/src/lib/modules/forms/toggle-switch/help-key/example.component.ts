import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyToggleSwitchModule } from '@skyux/forms';

interface ToggleSwitchFormType {
  registration: FormControl<boolean | null>;
}

/**
 * @title Toggle switch with help key
 */
@Component({
  selector: 'app-forms-toggle-switch-help-key-example',
  templateUrl: './example.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyToggleSwitchModule],
})
export class FormsToggleSwitchHelpKeyExampleComponent {
  protected formGroup: FormGroup;

  constructor() {
    this.formGroup = inject(FormBuilder).group<ToggleSwitchFormType>({
      registration: new FormControl(false),
    });
  }
}
