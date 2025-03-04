import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';

import { SkyDocsCategoryTagModule } from '../../category-tag/category-tag.module';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-elevation-0-bordered sky-rounded-corners',
    '[class.sky-margin-stacked-xl]': 'stacked()',
  },
  imports: [SkyDocsCategoryTagModule],
  selector: 'sky-docs-type-definition-box',
  styleUrl: './box.component.scss',
  templateUrl: './box.component.html',
})
export class SkyDocsTypeDefinitionBoxComponent {
  public headingText = input.required<string>();

  public deprecated = input(false, { transform: booleanAttribute });
  public required = input(false, { transform: booleanAttribute });
  public stacked = input(false, { transform: booleanAttribute });
}
