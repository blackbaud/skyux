import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyColorpickerModule } from '@skyux/colorpicker';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/indicators';
import { SkyModalInstance } from '@skyux/modals';
import { SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    SkyColorpickerModule,
    SkyIconModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyModalModule,
    ReactiveFormsModule,
  ],
})
export class ModalComponent {
  public form: UntypedFormGroup;
  public fields: string[] = [];

  constructor(
    fb: UntypedFormBuilder,
    public modal: SkyModalInstance,
    @Inject('modalTitle') public title: string
  ) {
    const controls: Record<string, AbstractControl> = {};
    for (let i = 1; i <= 5; i++) {
      const field = `${this.title} ${i}`;
      this.fields.push(field);
      controls[field] = fb.control('');
    }
    this.form = fb.group(controls);
    this.modal.closed.subscribe((args) => {
      if (args.reason === 'save') {
        console.log(this.form.value);
      }
    });
  }
}
