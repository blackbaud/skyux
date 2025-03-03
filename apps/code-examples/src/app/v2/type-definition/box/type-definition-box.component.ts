import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';
import { SkyDocsCategoryTagModule } from '@skyux/docs-tools';

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
  styleUrl: './type-definition-box.component.scss',
  templateUrl: './type-definition-box.component.html',
})
export class SkyDocsTypeDefinitionBoxComponent {
  public headingText = input.required<string>();

  public deprecated = input(false, { transform: booleanAttribute });
  public required = input(false, { transform: booleanAttribute });
  public stacked = input(false, { transform: booleanAttribute });
}
