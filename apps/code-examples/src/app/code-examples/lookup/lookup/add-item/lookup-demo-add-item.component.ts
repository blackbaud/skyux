import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkyModalInstance } from '@skyux/modals';

let nextId = 21;

@Component({
  selector: 'app-lookup-demo-add-item',
  templateUrl: './lookup-demo-add-item.component.html',
})
export class LookupDemoAddItemComponent {
  public readonly formGroup: FormGroup;

  #modal = inject(SkyModalInstance);

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      id: [`${nextId++}`],
      name: ['', Validators.required],
    });
  }

  public close() {
    this.#modal.close();
  }

  public save() {
    if (this.formGroup.valid) {
      this.#modal.close(this.formGroup.value, 'save');
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
