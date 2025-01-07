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

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyToggleSwitchModule],
})
export class DemoComponent {
  protected formGroup: FormGroup;
  protected helpPopoverContent =
    'When you open an event, a registration page becomes available online, and admins are able to register people to attend.';

  constructor() {
    this.formGroup = inject(FormBuilder).group<ToggleSwitchFormType>({
      registration: new FormControl(false),
    });
  }
}
