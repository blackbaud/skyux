
import {
  Component
} from '@angular/core';

/**
 * Simple component for testing a reorderable repeater with missing tags (error state)
 */
@Component({
  template: `
    <sky-repeater
      [reorderable]="true"
    >
    <sky-repeater-item
      [tag]="item1"
    >
      <sky-repeater-item-title>
        Item 1
      </sky-repeater-item-title>
    </sky-repeater-item>
    <sky-repeater-item>
      <sky-repeater-item-title>
        Item 2 (I'm missing a tag input!)
      </sky-repeater-item-title>
    </sky-repeater-item>
  </sky-repeater>
  `
})
export class RepeaterWithMissingTagsFixtureComponent {}
