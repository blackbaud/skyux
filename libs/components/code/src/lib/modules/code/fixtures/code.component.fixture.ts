import { Component } from '@angular/core';

import { SkyCode } from '../code';

@Component({
  selector: 'sky-code-test',
  imports: [SkyCode],
  template: `
    <p>
      To edit the <sky-code data-sky-id="plain-code">.npmrc</sky-code> file, you
      may need to show hidden folder files.
    </p>
    <p>
      <sky-code data-sky-id="code-with-link">
        <a data-sky-id="inner-link" href="#">SkyCode</a>
      </sky-code>
    </p>
    <p>
      <a href="#">
        <sky-code data-sky-id="code-in-link">SkyCode</sky-code>
      </a>
    </p>
  `,
})
export class SkyCodeTestComponent {}
