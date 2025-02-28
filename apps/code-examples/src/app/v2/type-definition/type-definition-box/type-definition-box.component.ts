import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';
import { SkyPillModule } from '@skyux/docs-tools';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sky-margin-stacked-xl]': 'stacked()',
  },
  imports: [SkyPillModule],
  selector: 'sky-docs-type-definition-box',
  styleUrl: './type-definition-box.component.scss',
  templateUrl: './type-definition-box.component.html',
})
export class SkyDocsTypeDefinitionBoxComponent {
  public deprecated = input(false, { transform: booleanAttribute });
  public headingText = input.required<string>();
  public required = input(false, { transform: booleanAttribute });
  public stacked = input(false, { transform: booleanAttribute });
}
