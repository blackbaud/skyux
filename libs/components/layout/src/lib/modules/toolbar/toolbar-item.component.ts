import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies a container for an item in the toolbar.
 */
@Component({
  selector: 'sky-toolbar-item',
  styleUrls: ['./toolbar-item.component.scss'],
  templateUrl: './toolbar-item.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyToolbarItemComponent {}
