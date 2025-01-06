import { Component, ViewEncapsulation } from '@angular/core';

/**
 * Displays buttons within the page header for page actions and applies spacing between buttons.
 * Appears below the page header details.
 */
@Component({
  selector: 'sky-page-header-actions',
  template: `<ng-content />`,
  styleUrls: ['./page-header-actions.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SkyPageHeaderActionsComponent {}
