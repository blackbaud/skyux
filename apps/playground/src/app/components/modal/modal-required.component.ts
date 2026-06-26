import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

function round(val: number): number {
  return Math.round(val * 10) / 10;
}

@Component({
  imports: [ReactiveFormsModule, SkyInputBoxModule, SkyModalModule],
  template: `
    <sky-modal
      headingText="Required modal"
      (mousedown)="onMousedown()"
      (mouseup)="onMouseup()"
    >
      <sky-modal-content>
        <sky-input-box labelText="Required field 1" stacked="true">
          <input type="text" [formControl]="requiredField1" />
        </sky-input-box>
        <sky-input-box labelText="Required field 2" stacked="true">
          <input type="text" [formControl]="requiredField2" />
        </sky-input-box>
        <sky-input-box labelText="Required field 3">
          <input type="text" [formControl]="requiredField3" />
        </sky-input-box>
      </sky-modal-content>
      <sky-modal-footer>
        <button
          class="sky-btn sky-btn-primary"
          type="button"
          (click)="instance.close()"
        >
          Close
        </button>
      </sky-modal-footer>
    </sky-modal>
  `,
})
export class ModalRequiredComponent {
  protected readonly instance = inject(SkyModalInstance);

  protected readonly requiredField1 = new FormControl('', Validators.required);
  protected readonly requiredField2 = new FormControl('', Validators.required);
  protected readonly requiredField3 = new FormControl('', Validators.required);

  #clickStart = 0;
  #clicks: number[] = [];

  protected onMousedown(): void {
    this.#clickStart = performance.now();
  }

  protected onMouseup(): void {
    const duration = round(performance.now() - this.#clickStart);
    this.#clicks.push(duration);

    const averageDuration = round(
      this.#clicks.reduce((prev, cur) => prev + cur, 0) / this.#clicks.length,
    );

    console.log(
      `Click duration: ${duration}ms (average: ${averageDuration}ms)`,
    );
  }
}
