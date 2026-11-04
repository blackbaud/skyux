import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyButton, SkyInputBoxModule } from '@skyux/forms';
import {
  SkyInlineFormButtonLayout,
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig,
  SkyInlineFormModule,
} from '@skyux/inline-form';

interface DemoForm {
  firstName: FormControl<string>;
}

/**
 * @title Inline form with custom buttons
 */
@Component({
  selector: 'app-inline-form-custom-buttons-example',
  templateUrl: './example.component.html',
  imports: [
    ReactiveFormsModule,
    SkyButton,
    SkyInlineFormModule,
    SkyInputBoxModule,
  ],
})
export class InlineFormCustomButtonsExampleComponent {
  protected readonly firstName = signal('Jane');
  public formGroup: FormGroup<DemoForm> = inject(FormBuilder).group({
    firstName: new FormControl<string>('', { nonNullable: true }),
  });

  readonly #formStatus = toSignal(this.formGroup.statusChanges, {
    initialValue: this.formGroup.status,
  });

  protected readonly inlineFormConfig = computed<SkyInlineFormConfig>(() => ({
    buttonLayout: SkyInlineFormButtonLayout.Custom,
    buttons: [
      {
        action: 'save',
        text: 'Save',
        styleType: 'primary',
        disabled: this.#formStatus() === 'INVALID',
      },
      {
        action: 'clear',
        text: 'Clear',
        styleType: 'default',
      },
      {
        action: 'reset',
        text: 'Reset',
        styleType: 'default',
      },
      {
        action: 'cancel',
        text: 'Cancel',
        styleType: 'link',
      },
    ],
  }));

  protected readonly showForm = signal(false);

  protected onInlineFormClose(args: SkyInlineFormCloseArgs): void {
    switch (args.reason) {
      case 'save':
        this.firstName.set(this.formGroup.value.firstName ?? '');
        this.showForm.set(false);
        break;

      case 'clear':
        this.formGroup.patchValue({ firstName: '' });
        break;

      case 'reset':
        this.formGroup.setValue({ firstName: this.firstName() });
        break;

      default:
        this.showForm.set(false);
        break;
    }
  }

  protected onInlineFormOpen(): void {
    this.showForm.set(true);
    this.formGroup.patchValue({
      firstName: this.firstName(),
    });
  }
}
