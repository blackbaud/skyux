import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

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
   * Specifies the local path to the code example's source code. The value is relative to the root directory.
   * @required
   */
  @Input()
  public sourceCodePath: string;

  /**
   * The heading to be used for the code example.
   * @required
   */
  @Input()
  public heading: string;

}
