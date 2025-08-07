import { Component, inject, input } from '@angular/core';
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
  selector: 'test-toggle-switch-harness',
  templateUrl: './toggle-switch-harness-test.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyToggleSwitchModule],
})
export class ToggleSwitchHarnessTestComponent {
  public helpKey = input<string | undefined>();
  public helpPopoverContent = input<string | undefined>('popover content');
  public helpPopoverTitle = input<string | undefined>();
  public labelHidden = input<boolean>(false);
  public labelText = input<string | undefined>('Label text');
  public useAlternateLabel = input<boolean>(false);
  protected formGroup: FormGroup;

  constructor() {
    this.formGroup = inject(FormBuilder).group<ToggleSwitchFormType>({
      registration: new FormControl(false),
    });
  }

  public disableForm(): void {
    this.formGroup.disable();
  }
}
