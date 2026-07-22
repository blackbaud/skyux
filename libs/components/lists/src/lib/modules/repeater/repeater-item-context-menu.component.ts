import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Creates a container for a
 * [`sky-dropdown` component](https://developer.blackbaud.com/skyux-popovers/docs/dropdown)
 * or an action button. When the container wraps a dropdown, it provides the dropdown with a
 * contextual accessibility name. Use the `icon-borderless` CSS class to style an action button,
 * such as an edit or delete button, placed within the container.
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
