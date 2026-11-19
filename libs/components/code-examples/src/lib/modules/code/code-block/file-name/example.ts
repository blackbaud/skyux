import { Component } from '@angular/core';
import { SkyCodeBlock } from '@skyux/code';

/**
 * @title Code block with a file name
 */
@Component({
  selector: 'app-code-code-block-file-name-example',
  templateUrl: './example.html',
  imports: [SkyCodeBlock],
})
export class CodeCodeBlockFileNameExample {
  protected readonly code = `
    export function greet(name: string): string {
      return \`Hello, \${name}!\`;
    }
  `;
}
