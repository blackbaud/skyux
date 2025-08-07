import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import {
  SkyDateRangeCalculation,
  SkyDateRangeCalculatorId,
  SkyDateRangePickerModule,
} from '@skyux/datetime';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-modal-date-range-picker-modal',
  templateUrl: './modal-date-range-picker-modal.component.html',
  // styleUrls: ['./modal-date-range-picker-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyModalModule,
    FormsModule,
    SkyDateRangePickerModule,
    SkyIdModule,
    ReactiveFormsModule,
  ],
})
export class ModalDateRangePickerModalComponent {
  protected readonly cdr = inject(ChangeDetectorRef);

  protected readonly modalInstance = inject(SkyModalInstance);

  protected dateForm = inject(FormBuilder).group({
    date: new FormControl<SkyDateRangeCalculation>({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
    }),
  });
}
