import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyLookupShowMoreCustomPickerContext } from '@skyux/lookup';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-lookup-custom-picker',
  templateUrl: './lookup-custom-picker.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyModalModule,
  ],
})
export class LookupCustomPickerComponent implements OnInit {
  public myForm: UntypedFormGroup;

  readonly #formBuilder = inject(UntypedFormBuilder);
  public readonly context = inject(SkyLookupShowMoreCustomPickerContext);
  public readonly modalInstance = inject(SkyModalInstance);

  public ngOnInit(): void {
    this.myForm = this.#formBuilder.group({
      selectLast: new UntypedFormControl(false),
    });
  }
}
