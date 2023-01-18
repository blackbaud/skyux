import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SkyLookupShowMoreCustomPickerContext } from '@skyux/lookup';
import { SkyModalInstance } from '@skyux/modals';

import { LookupDemoPerson } from './lookup-demo-person';

@Component({
  selector: 'app-lookup-demo-modal',
  templateUrl: './lookup-custom-picker-demo-modal.component.html',
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
