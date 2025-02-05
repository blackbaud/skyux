import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkySectionedFormService } from '@skyux/tabs';

@Component({
  selector: 'app-information-form',
  templateUrl: './information-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyFluidGridModule,
    SkyStatusIndicatorModule,
  ],
})
export class InformationFormComponent implements OnInit {
  protected id = '5324901';
  protected formGroup: FormGroup<{
    name: FormControl<string>;
    nameRequired: FormControl<boolean>;
    id: FormControl<string>;
  }>;
  protected name = '';
  protected nameRequired = false;

  readonly #sectionedFormSvc = inject(SkySectionedFormService);
  readonly #changeDetector = inject(ChangeDetectorRef);

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      name: new FormControl(this.name, { nonNullable: true }),
      nameRequired: new FormControl(this.nameRequired, { nonNullable: true }),
      id: new FormControl(this.id, {
        nonNullable: true,
        validators: [Validators.pattern('^[0-9]+$')],
      }),
    });
  }

  public ngOnInit(): void {
    this.formGroup.valueChanges.subscribe((changes) => {
      this.id = changes.id ?? '';
      this.name = changes.name ?? '';
      this.nameRequired = !!changes.nameRequired;
      this.#checkValidity();
    });

    this.#changeDetector.markForCheck();
  }

  #checkValidity(): void {
    if (this.nameRequired) {
      this.formGroup.get('name')?.setValidators([Validators.required]);
      this.#sectionedFormSvc.requiredFieldChanged(true);
    } else {
      this.formGroup.get('name')?.setValidators([]);
      this.#sectionedFormSvc.requiredFieldChanged(false);
    }

    if (!this.formGroup.get('name')?.value && this.nameRequired) {
      this.#sectionedFormSvc.invalidFieldChanged(true);
    } else {
      this.#sectionedFormSvc.invalidFieldChanged(false);
    }
  }
}
