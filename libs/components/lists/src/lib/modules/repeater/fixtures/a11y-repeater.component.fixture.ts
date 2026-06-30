import { Component, input, model } from '@angular/core';

import { SkyRepeaterExpandModeType } from '../repeater-expand-mode-type';

import { A11yRepeaterItem } from './a11y-repeater-item';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './a11y-repeater.component.fixture.html',
  standalone: false,
})
export class A11yRepeaterTestComponent {
  public activeIndex = model<number | undefined>(undefined);

  public expandMode = input<SkyRepeaterExpandModeType | undefined>(undefined);

  public reorderable = input<boolean | undefined>(undefined);

  public items = input<A11yRepeaterItem[] | undefined>(undefined);
}
