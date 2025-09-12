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
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyModalModule } from '@skyux/modals';

import { FilterItems } from '../filter-items';

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
export class CommunityConnectionFilterModalComponent
  implements SkyFilterItemModal<FilterItems>
{
  public readonly modalInstance = inject<
    SkyFilterItemModalInstance<FilterItems>
  >(SkyFilterItemModalInstance);
  readonly #context = this.modalInstance.context;
  readonly #formBuilder: FormBuilder = inject(FormBuilder);
  protected headingText = this.#context.filterLabelText;
  protected items = this.#context.additionalContext!.items;
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
      this.modalInstance.save({ filterValue: selectedItem });
    } else {
      this.modalInstance.save({});
    }
  }
}
