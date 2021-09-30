import {
  Component
} from '@angular/core';

@Component({
  template: `
    <sky-radio-group
      [disabled]="disableRadioGroup"
    >
      <sky-radio *ngFor="let item of items"
        [disabled]="item.disabled"
        [value]="item.value"
      >
        <sky-radio-label>
          {{ item.value }}
        </sky-radio-label>
      </sky-radio>
    </sky-radio-group>
  `
})
export class SkyRadioGroupFixtureComponent {

  public disableRadioGroup: boolean;

  public items = [
    { value: '1', disabled: false },
    { value: '2', disabled: false },
    { value: '3', disabled: false }
  ];
}
