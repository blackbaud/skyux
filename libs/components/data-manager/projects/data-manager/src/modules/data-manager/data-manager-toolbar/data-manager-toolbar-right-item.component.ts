import { Component } from '@angular/core';

/**
 * A wrapper for an item to be rendered in `SkyDataManagerToolbarComponent`. The contents are
 * rendered in `sky-toolbar-view-actions` on the right side of the toolbar and before the view
 * switcher icons (if present). Each item should be wrapped in its own
 * `sky-data-manager-toolbar-right-item`. The items render in the order they are in in the template.
 */
@Component({
  selector: 'sky-data-manager-toolbar-right-item',
  templateUrl: './data-manager-toolbar-right-item.component.html',
})
export class SkyDataManagerToolbarRightItemComponent {}
