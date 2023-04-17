import { Component } from '@angular/core';
import { SkyRepeaterExpandModeType } from '../repeater-expand-mode-type';

export interface A11yRepeaterItem {
  selectable?: boolean;
  selected?: boolean;
  disabled?: boolean;
  expanded?: boolean;
  reorderable?: boolean;
  title?: string;
  message?: string;
  context?: boolean;
  tag?: string;
}

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './a11y-repeater.component.fixture.html',
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
