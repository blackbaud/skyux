import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'sky-link-list-item',
  template: `<ng-content />`,
  styles: `
    :host {
      display: block;
      margin: 0 0 var(--sky-margin-stacked-sm) 0;
    }
  `,
  host: {
    '[attr.role]': '"listitem"',
  },
})
export class SkyLinkListItemComponent {}
