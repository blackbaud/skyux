import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  template: `
    <sky-radio-group [disabled]="disableRadioGroup">
      @for (item of items; track item.value) {
        <sky-radio [disabled]="item.disabled" [value]="item.value">
          <sky-radio-label>
            {{ item.value }}
          </sky-radio-label>
        </sky-radio>
      }
    </sky-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyRadioGroupFixtureComponent {
  public disableRadioGroup = false;

  public items = [
    { value: '1', disabled: false },
    { value: '2', disabled: false },
    { value: '3', disabled: false },
  ];
}
