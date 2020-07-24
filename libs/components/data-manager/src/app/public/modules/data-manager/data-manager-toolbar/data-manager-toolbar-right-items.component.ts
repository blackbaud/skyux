import {
  Component
} from '@angular/core';

/**
 * A wrapper for items to be rendered in the `SkyDataManagerToolbarComponent`. The contents will be
 * rendered within the `sky-toolbar-view-actions` at the right of the toolbar and before the view switcher icons (if present).
 * Items do not need to be wrapped in a `<sky-toolbar-item>` wrapper.
 */
@Component({
  selector: 'sky-data-manager-toolbar-right-items',
  templateUrl: './data-manager-toolbar-right-items.component.html'
})
export class SkyDataManagerToolbarRightItemsComponent { }
