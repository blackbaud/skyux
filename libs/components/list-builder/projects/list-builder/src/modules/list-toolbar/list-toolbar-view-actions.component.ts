import { Component } from '@angular/core';

/**
 * Adds a section on the right side of the toolbar for items that substantially change
 * or affect the view of the list. This includes simple filters and view switchers.
 * If the view section includes more than one item, simple filters appear on the left
 * and view switchers appear on the right.
 */
@Component({
  selector: 'sky-list-toolbar-view-actions',
  templateUrl: './list-toolbar-view-actions.component.html',
  styleUrls: ['./list-toolbar-view-actions.component.scss'],
})
export class SkyListToolbarViewActionsComponent {}
