import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Displays page contents using spacing that corresponds to the parent
 * page's layout.
 */
@Component({
  selector: 'sky-page-content',
  template: `<ng-content />`,
  styleUrls: ['./page-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyPageContentComponent {}
