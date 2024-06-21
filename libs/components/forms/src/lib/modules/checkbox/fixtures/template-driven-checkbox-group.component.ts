import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  NgForm,
  NgModelGroup,
} from '@angular/forms';

import { SkyCheckboxModule } from '../checkbox.module';

@Component({
  imports: [CommonModule, FormsModule, SkyCheckboxModule],
  selector: 'sky-template-driven-checkbox-group',
  standalone: true,
  template: `
    <form>
      <sky-checkbox-group
        headingText="Contact method"
        ngModelGroup="model"
        [required]="required"
        #templateFormGroup="ngModelGroup"
      >
        <sky-checkbox labelText="Email" name="email" ngModel />
        <sky-checkbox labelText="Phone" name="phone" ngModel />
        <sky-checkbox labelText="Text" name="text" ngModel />
      </sky-checkbox-group>
    </form>
  `,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class SkyTemplateDrivenCheckboxGroupComponent {
  @ViewChild('templateFormGroup', { static: true })
  protected templateFormGroup: NgModelGroup | undefined;

  protected model = {
    email: false,
    phone: false,
    text: false,
  };

  public required = false;

  public submitForm(): void {
    this.templateFormGroup?.control.markAsDirty();
    this.templateFormGroup?.control.markAsTouched();
  }
}
