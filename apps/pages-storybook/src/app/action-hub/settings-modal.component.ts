import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
})
export class SettingsModalComponent {
  public form: FormGroup;
  public fields: string[] = [];

  constructor(
    private fb: FormBuilder,
    public modal: SkyModalInstance,
    @Inject('modalTitle') public title: string
  ) {
    const controls = {};
    for (let i = 1; i <= 5; i++) {
      const field = `${this.title} ${i}`;
      this.fields.push(field);
      controls[field] = this.fb.control('');
    }
    this.form = this.fb.group(controls);
    this.modal.closed.subscribe((args) => {
      if (args.reason === 'save') {
        console.log(this.form.value);
      }
    });
  }
}
