import { Component, ViewEncapsulation, input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

/**
 * Displays a code block's highlighted code. Unlike the code block, its styles
 * aren't encapsulated, because the highlighted markup is inserted with
 * innerHTML and never gets Angular's emulated-encapsulation attribute.
 * @internal
 */
@Component({
  selector: 'sky-code-block-output',
  templateUrl: './code-block-output.html',
  styleUrls: ['./code-block-output.scss', './themes/syntax.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SkyCodeBlockOutput {
  public readonly html = input.required<SafeHtml>();
}
