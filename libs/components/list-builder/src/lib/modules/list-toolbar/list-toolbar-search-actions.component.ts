import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Displays custom actions in the toolbar beside to the search bar.
 * @deprecated
 */
@Component({
  selector: 'sky-list-toolbar-search-actions',
  templateUrl: './list-toolbar-search-actions.component.html',
  styleUrls: ['./list-toolbar-search-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyListToolbarSearchActionsComponent {}
