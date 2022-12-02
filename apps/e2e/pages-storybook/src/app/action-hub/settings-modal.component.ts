import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
})
export class SettingsModalComponent {
  public form: UntypedFormGroup;
  public fields: string[] = [];

  #fb: UntypedFormBuilder;

  constructor(
    fb: UntypedFormBuilder,
    public modal: SkyModalInstance,
    @Inject('modalTitle') public title: string
  ) {
    this.#fb = fb;
    const controls: { [key: string]: unknown } = {};
    for (let i = 1; i <= 5; i++) {
      const field = `${this.title} ${i}`;
      this.fields.push(field);
      controls[field] = this.#fb.control('');
    }
    this.form = this.#fb.group(controls);
    this.modal.closed.subscribe((args) => {
      if (args.reason === 'save') {
        console.log(this.form.value);
      }
    });
  }
}
