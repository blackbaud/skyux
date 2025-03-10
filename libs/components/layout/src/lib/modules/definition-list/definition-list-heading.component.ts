import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies a title for the definition list.
 * @deprecated
 */
@Component({
  selector: 'sky-definition-list-heading',
  templateUrl: './definition-list-heading.component.html',
  styleUrls: ['./definition-list-heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyDefinitionListHeadingComponent {}
