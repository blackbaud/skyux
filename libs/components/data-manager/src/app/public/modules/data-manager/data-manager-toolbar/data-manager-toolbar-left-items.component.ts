import {
  Component
} from '@angular/core';

/**
 * A wrapper for items to be rendered in the `SkyDataManagerToolbarComponent`. The contents will be
 * rendered after the standard toolbar actions and before the search box. Each item within the
 * wrapper should be wrapped in a `<sky-toolbar-item>` element to ensure proper styling.
 */
@Component({
  selector: 'sky-data-manager-toolbar-left-items',
  templateUrl: './data-manager-toolbar-left-items.component.html'
})
export class SkyDataManagerToolbarLeftItemsComponent { }
