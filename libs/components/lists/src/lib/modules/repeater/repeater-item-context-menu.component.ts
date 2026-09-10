import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Displays a dropdown menu or a single button to allow users to perform
 * actions on repeater items. For multiple actions, display the actions in a
 * [`sky-dropdown` component](https://developer.blackbaud.com/skyux/components/dropdown)
 * or action buttons such as Edit/Delete using the `sky-btn-icon-borderless` class.
 *
 * When wrapping a dropdown, this component provides the dropdown's contextual
 * accessibility name.
 */
@Component({
  selector: 'sky-repeater-item-context-menu',
  templateUrl: './repeater-item-context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
/* istanbul ignore next */
/* Code coverage having problems with no statements in classes */
export class SkyRepeaterItemContextMenuComponent {}
