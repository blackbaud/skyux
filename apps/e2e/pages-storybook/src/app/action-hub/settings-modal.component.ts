import { Component, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  standalone: false,
})
export class SettingsModalComponent {
  public form: UntypedFormGroup;
  public fields: string[] = [];

  readonly #fb = inject(UntypedFormBuilder);
  protected readonly modal = inject(SkyModalInstance);
  protected readonly title = inject<string>('modalTitle');

  constructor() {
    const controls: Record<string, unknown> = {};
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
