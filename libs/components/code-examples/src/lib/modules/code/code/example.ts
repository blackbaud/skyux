import { Component } from '@angular/core';
import { SkyCodeComponent } from '@skyux/code';

/**
 * @title Code with inline tokens
 */
@Component({
  selector: 'app-code-example',
  templateUrl: './example.html',
  imports: [SkyCodeComponent],
})
export class CodeExample {}
