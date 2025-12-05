import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SkyAutonumericModule,
  SkyAutonumericOptions,
} from '@skyux/autonumeric';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyAlertModule } from '@skyux/indicators';

/**
 * @title Predefined options
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-autonumeric-presets',
  templateUrl: './autonumeric-presets.component.html',
  imports: [
    ReactiveFormsModule,
    SkyAlertModule,
    SkyAutonumericModule,
    SkyInputBoxModule,
  ],
})
export class AutonumericPresetsComponent {
  readonly #amountControl = new FormControl(1234.5678, [Validators.required]);

  protected readonly formGroup = inject(FormBuilder).group({
    amount: this.#amountControl,
  });

  protected autonumericOptions: SkyAutonumericOptions = 'Chinese';

  protected readonly rawValue = toSignal(this.#amountControl.valueChanges, {
    initialValue: this.#amountControl.value,
  });

  protected readonly valueChangesCount = signal(0);

  constructor() {
    effect(() => {
      this.rawValue();
      this.valueChangesCount.update((count) => count + 1);
    });
  }
}
