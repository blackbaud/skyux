import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Wraps the label-value pairs in the definition list.
 * @deprecated Use `SkyDescriptionListContentComponent` instead.
 */
@Component({
  selector: 'sky-definition-list-content',
  templateUrl: './definition-list-content.component.html',
  styleUrls: ['./definition-list-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyDefinitionListContentComponent {}
