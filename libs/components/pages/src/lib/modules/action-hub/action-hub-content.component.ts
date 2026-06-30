import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Displays additional content after the action items.
 */
@Component({
  selector: 'sky-action-hub-content',
  templateUrl: 'action-hub-content.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyActionHubContentComponent {}
