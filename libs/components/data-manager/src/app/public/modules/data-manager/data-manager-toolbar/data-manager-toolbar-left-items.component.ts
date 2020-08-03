import {
  Component
} from '@angular/core';

/**
 * A wrapper for items to be rendered in `SkyDataManagerToolbarComponent`. The contents are
 * rendered after the standard toolbar actions and before the search box. Wrap each item
 * in a`<sky-toolbar-item>` element to ensure proper styling.
 */
@Component({
  selector: 'sky-data-manager-toolbar-left-items',
  templateUrl: './data-manager-toolbar-left-items.component.html'
})
export class SkyDataManagerToolbarLeftItemsComponent { }
