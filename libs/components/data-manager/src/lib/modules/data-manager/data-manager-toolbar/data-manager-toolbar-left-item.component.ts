import { Component } from '@angular/core';
import { SkyToolbarModule } from '@skyux/layout';

/**
 * A wrapper for an item to be rendered in `SkyDataManagerToolbarComponent`. The contents are
 * rendered after the standard toolbar actions and before the search box. Each item should be
 * wrapped in its own `sky-data-manager-toolbar-left-item`. The items render in the order they are in in the template.
 */
@Component({
  standalone: true,
  selector: 'sky-data-manager-toolbar-left-item',
  templateUrl: './data-manager-toolbar-left-item.component.html',
  imports: [SkyToolbarModule],
})
export class SkyDataManagerToolbarLeftItemComponent {}
