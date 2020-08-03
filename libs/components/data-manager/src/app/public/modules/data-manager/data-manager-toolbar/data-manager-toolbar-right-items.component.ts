import {
  Component
} from '@angular/core';

/**
 * A wrapper for items to be rendered in `SkyDataManagerToolbarComponent`. The contents are
 * rendered in `sky-toolbar-view-actions` on the right side of the toolbar and before the view
 * switcher icons (if present). You do not need to wrap items in a `<sky-toolbar-item>` element.
 */
@Component({
  selector: 'sky-data-manager-toolbar-right-items',
  templateUrl: './data-manager-toolbar-right-items.component.html'
})
export class SkyDataManagerToolbarRightItemsComponent { }
