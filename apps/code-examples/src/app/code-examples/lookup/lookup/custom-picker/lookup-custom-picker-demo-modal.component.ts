import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

import { LookupDemoPerson } from './lookup-demo-person';

@Component({
  standalone: true,
  selector: 'app-lookup-demo-modal',
  templateUrl: './lookup-custom-picker-demo-modal.component.html',
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
export class LookupCustomPickerDemoModalComponent {
  public peopleForm: FormGroup<{
    people: FormArray<FormControl<boolean>>;
  }>;

  public people: LookupDemoPerson[];

  #modalInstance: SkyModalInstance;

  constructor(
    context: SkyLookupShowMoreCustomPickerContext,
    modalInstance: SkyModalInstance,
    formBuilder: FormBuilder
  ) {
    this.#modalInstance = modalInstance;

    // This list of people will be rendered as selection boxes.
    this.people = context.items;

    // Create a control for each selection box.
    this.peopleForm = formBuilder.group({
      people: formBuilder.array(
        context.items.map((item) =>
          formBuilder.control(context.initialValue?.includes(item))
        )
      ),
    });
  }

  public save(): void {
    // Return a list of selected people to the lookup component.
    const selectedPeople = this.people.filter(
      (_, index) =>
        this.peopleForm.value.people && this.peopleForm.value.people[index]
    );

    this.#modalInstance.save(selectedPeople);
  }
}
