import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyCheckboxModule, SkySelectionBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/indicators';
import { SkyLookupShowMoreCustomPickerContext } from '@skyux/lookup';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { Person } from './person';

@Component({
  standalone: true,
  selector: 'app-picker-modal',
  templateUrl: './picker-modal.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyModalModule,
    SkySelectionBoxModule,
  ],
})
export class PickerModalComponent {
  protected peopleForm: FormGroup<{
    people: FormArray<FormControl<boolean>>;
  }>;

  protected people: Person[];

  protected readonly context = inject(SkyLookupShowMoreCustomPickerContext);
  readonly #formBuilder = inject(FormBuilder);
  readonly #modalInstance = inject(SkyModalInstance);

  constructor() {
    // This list of people will be rendered as selection boxes.
    this.people = this.context.items as Person[];

    // Create a control for each selection box.
    this.peopleForm = this.#formBuilder.group({
      people: this.#formBuilder.array(
        this.context.items.map((item: Person) =>
          this.#formBuilder.control(
            (this.context.initialValue as Person[]).includes(item),
            { nonNullable: true },
          ),
        ),
      ),
    });
  }

  protected save(): void {
    // Return a list of selected people to the lookup component.
    const selectedPeople = this.people.filter(
      (_, index) =>
        this.peopleForm.value.people?.[index],
    );

    this.#modalInstance.save(selectedPeople);
  }
}
