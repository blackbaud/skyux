import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import {
  SkyProgressIndicatorActionClickArgs,
  SkyProgressIndicatorChange,
  SkyProgressIndicatorDisplayModeType,
  SkyProgressIndicatorModule,
} from '@skyux/progress-indicator';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports: [
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyProgressIndicatorModule,
  ],
})
export class ModalComponent {
  protected activeIndex: number | undefined = 0;
  protected displayMode: SkyProgressIndicatorDisplayModeType = 'horizontal';
  protected formGroup: FormGroup;
  protected title = 'Wizard example';

  protected get requirementsMet(): boolean {
    switch (this.activeIndex) {
      case 0:
        return !!this.formGroup.get('requiredValue1')?.value;
      case 1:
        return !!this.formGroup.get('requiredValue2')?.value;
      default:
        return false;
    }
  }

  protected readonly instance = inject(SkyModalInstance);

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      requiredValue1: undefined,
      requiredValue2: undefined,
    });
  }

  protected onCancelClick(): void {
    this.instance.cancel();
  }

  protected onSaveClick(args: SkyProgressIndicatorActionClickArgs): void {
    args.progressHandler.advance();
    this.instance.save();
  }

  protected updateIndex(changes: SkyProgressIndicatorChange): void {
    this.activeIndex = changes.activeIndex;
  }
}
