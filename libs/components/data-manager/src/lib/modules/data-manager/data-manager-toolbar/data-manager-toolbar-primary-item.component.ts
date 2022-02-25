import { Component } from '@angular/core';

/**
 * A wrapper for an item to be rendered in `SkyDataManagerToolbarComponent`. The contents are
 * rendered as the first items in the toolbar and should be standard actions. Each item should be
 * wrapped in its own `sky-data-manager-toolbar-primary-item`. The items render in the order they are in in the template.
 */
@Component({
  selector: 'sky-data-manager-toolbar-primary-item',
  templateUrl: './data-manager-toolbar-primary-item.component.html',
})
export class SkyDataManagerToolbarPrimaryItemComponent {}
