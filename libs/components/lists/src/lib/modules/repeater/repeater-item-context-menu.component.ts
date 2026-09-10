import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Wraps a dropdown menu or a single button to display actions that users can
 * perform on repeater items. For multiple actions, display the actions in a
 * [dropdown component](https://developer.blackbaud.com/skyux/components/dropdown).
 * The context menu styles the dropdown and provides its contextual accessibility name.
 * For a single action, such as edit or delete, use a
 * [button](https://developer.blackbaud.com/skyux/components/button)
 * with the `sky-btn-icon-borderless` class.
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
