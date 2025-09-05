import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  SkyFilterBarFilterModalContext,
  SkyFilterBarFilterValue,
} from '@skyux/filter-bar';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-community-connection-filter-modal',
  templateUrl: './community-connection-filter-modal.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyRepeaterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityConnectionFilterModalComponent {
  protected readonly modalInstance = inject(SkyModalInstance);
  readonly #context = inject(SkyFilterBarFilterModalContext);
  readonly #formBuilder: FormBuilder = inject(FormBuilder);
  protected headingText = this.#context.filterLabelText;
  protected items: SkyFilterBarFilterValue[] = this.#context
    .additionalContext?.['items'] as SkyFilterBarFilterValue[];
  protected selectedValue = this.#context.filterValue;

  protected formGroup: FormGroup = this.#formBuilder.group({
    selectedOption: this.#formBuilder.control(this.selectedValue?.value),
  });

  protected save(): void {
    const selectedValue = this.formGroup.get('selectedOption')?.value as string;

    if (selectedValue) {
      // Map the primitive value back to the full object
      const selectedItem = this.items.find(
        (item) => item.value === selectedValue,
      );
      this.modalInstance.save(selectedItem);
    } else {
      this.modalInstance.save(null);
    }
  }
}
