import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

/**
 * Adds a section on the right side of the toolbar for items that substantially alter
 * the view of the content container. This includes simple filters and view switchers.
 */
@Component({
  selector: 'sky-toolbar-view-actions',
  templateUrl: './toolbar-view-actions.component.html',
  styleUrls: ['./toolbar-view-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyToolbarViewActionsComponent { }
