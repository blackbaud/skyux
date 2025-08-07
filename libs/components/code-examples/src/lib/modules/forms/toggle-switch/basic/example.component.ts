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
 * @title Toggle switch with basic setup
 */
@Component({
  selector: 'app-forms-toggle-switch-basic-example',
  templateUrl: './example.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyToggleSwitchModule],
})
export class FormsToggleSwitchBasicExampleComponent {
  protected formGroup: FormGroup;
  protected helpPopoverContent =
    'When you open an event, a registration page becomes available online, and admins are able to register people to attend.';

  constructor() {
    this.formGroup = inject(FormBuilder).group<ToggleSwitchFormType>({
      registration: new FormControl(false),
    });
  }
}
