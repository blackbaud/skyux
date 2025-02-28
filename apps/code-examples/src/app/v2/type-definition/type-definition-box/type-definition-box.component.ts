import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';
import { SkyDocsPillModule } from '@skyux/docs-tools';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sky-margin-stacked-xl]': 'stacked()',
    // '[skyThemeClass]': `{
    //   'sky-shadow sky-border-dark': 'default',
    //   'sky-elevation-1-bordered': 'modern'
    // }`,
  },
  imports: [
    SkyDocsPillModule,
    // SkyThemeModule
  ],
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
