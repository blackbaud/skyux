import { Component } from '@angular/core';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

/**
 * A wrapper for each link in a link list.
 */
@Component({
  selector: 'sky-link-list-item',
  template: `<ng-content />`,
  styleUrl: './link-list-item.component.scss',
  host: {
    '[attr.role]': '"listitem"',
  },
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkyLinkListItemComponent {}
