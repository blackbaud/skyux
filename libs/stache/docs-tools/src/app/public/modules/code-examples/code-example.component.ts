import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsCodeExampleTheme
} from './code-example-theme';

/**
 * Renders a single code example.
 * @example
 * ```
 * <sky-docs-code-example
 *   heading="My code example"
 *   sourceCodePath="src/app/public/plugin-resources/foobar"
 * >
 * </sky-docs-code-example>
 * ```
 */
@Component({
  selector: 'sky-docs-code-example',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsCodeExampleComponent {

  /**
   * The heading to be used for the code example.
   * @required
   */
  @Input()
  public heading: string;

  /**
   * Specifies the local path to the code example's source code. The value is relative to the root directory.
   * @required
   */
  @Input()
  public sourceCodePath: string;

  /**
   * Specifies if the editor service should show the example in modern theme.
   */
  @Input()
  public theme: SkyDocsCodeExampleTheme = SkyDocsCodeExampleTheme.Default;

}
