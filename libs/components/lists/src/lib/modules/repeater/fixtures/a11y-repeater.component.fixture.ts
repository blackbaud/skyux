import { Component } from '@angular/core';

import { SkyRepeaterExpandModeType } from '../repeater-expand-mode-type';

import { A11yRepeaterItem } from './a11y-repeater-item';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './a11y-repeater.component.fixture.html',
  standalone: false,
})
export class A11yRepeaterTestComponent {
  public set activeIndex(value: number | undefined) {
    this.#_activeIndex = value;
  }

  public get activeIndex(): number | undefined {
    return this.#_activeIndex;
  }

  public expandMode: SkyRepeaterExpandModeType | undefined;

  public reorderable: boolean | undefined;

  public items: A11yRepeaterItem[] | undefined;

  #_activeIndex: number | undefined;
}
