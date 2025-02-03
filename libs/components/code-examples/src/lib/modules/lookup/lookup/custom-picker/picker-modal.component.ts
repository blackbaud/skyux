import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyCheckboxModule, SkySelectionBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyLookupShowMoreCustomPickerContext } from '@skyux/lookup';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { take } from 'rxjs/operators';

import { DemoService } from './example.service';
import { Person } from './person';

@Component({
  selector: 'app-picker-modal',
  templateUrl: './picker-modal.component.html',
  styleUrls: ['./picker-modal.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyModalModule,
    SkySelectionBoxModule,
    SkyWaitModule,
  ],
})
export class PickerModalComponent {
  protected peopleForm?: FormGroup<{
    people: FormArray<FormControl<boolean>>;
  }>;

  protected people: Person[] = [];

  protected readonly context = inject(SkyLookupShowMoreCustomPickerContext);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #formBuilder = inject(FormBuilder);
  readonly #modalInstance = inject(SkyModalInstance);
  readonly #svc = inject(DemoService);

  constructor() {
    // This list of people will be rendered as selection boxes.
    this.#svc
      .search('')
      .pipe(take(1))
      .subscribe((results) => {
        this.people = results.people;

        // Create a control for each selection box.
        this.peopleForm = this.#formBuilder.group({
          people: this.#formBuilder.array(
            this.people.map((item: Person) =>
              this.#formBuilder.control(
                (this.context.initialValue as Person[]).findIndex(
                  (initialItem) => initialItem.name === item.name,
                ) >= 0,
                { nonNullable: true },
              ),
            ),
          ),
        });
        this.#changeDetector.markForCheck();
      });
  }

  protected save(): void {
    // Return a list of selected people to the lookup component.
    const selectedPeople = this.people.filter(
      (_, index) => this.peopleForm?.value.people?.[index],
    );

    this.#modalInstance.save(selectedPeople);
  }
}
