import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

let nextId = 21;

@Component({
  standalone: true,
  selector: 'app-lookup-demo-add-item',
  templateUrl: './lookup-demo-add-item.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyModalModule,
  ],
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
