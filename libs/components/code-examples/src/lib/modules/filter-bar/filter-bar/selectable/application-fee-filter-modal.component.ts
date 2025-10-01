import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  SkyFilterItemModal,
  SkyFilterItemModalInstance,
} from '@skyux/filter-bar';
import { SkyInputBoxModule, SkyRadioModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-application-fee-filter-modal',
  templateUrl: './application-fee-filter-modal.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyRadioModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationFeeFilterModalComponent implements SkyFilterItemModal {
  public readonly modalInstance = inject(SkyFilterItemModalInstance);
  readonly #context = this.modalInstance.context;
  readonly #formBuilder: FormBuilder = inject(FormBuilder);
  protected headingText = this.#context.filterLabelText;
  protected options = [
    { value: null, displayValue: 'All' },
    { value: true, displayValue: 'Yes' },
    { value: false, displayValue: 'No' },
  ];
  protected selectedValue = this.#context.filterValue;

  protected formGroup: FormGroup = this.#formBuilder.group({
    selectedOption: this.#formBuilder.control(
      this.selectedValue?.value ?? null,
    ),
  });

  protected save(): void {
    const selectedValue = this.formGroup.get('selectedOption')?.value as
      | boolean
      | null;

    if (selectedValue !== null) {
      // Map the primitive value back to the full object
      const selectedItem = this.options.find(
        (item) => item.value === selectedValue,
      );
      this.modalInstance.save({ filterValue: selectedItem });
    } else {
      this.modalInstance.save({ filterValue: undefined });
    }
  }
}
