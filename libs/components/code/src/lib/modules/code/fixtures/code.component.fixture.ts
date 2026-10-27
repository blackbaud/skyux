import { Component } from '@angular/core';

import { SkyCodeComponent } from '../code.component';

@Component({
  selector: 'sky-code-test',
  imports: [SkyCodeComponent],
  template: `
    <p>
      To edit the <sky-code data-sky-id="plain-code">.npmrc</sky-code> file, you
      may need to show hidden folder files.
    </p>
    <p>
      <sky-code data-sky-id="code-with-link">
        <a data-sky-id="inner-link" href="#">SkyCodeComponent</a>
      </sky-code>
    </p>
    <p>
      <a data-sky-id="outer-link" href="#">
        <sky-code data-sky-id="code-in-link">SkyCodeComponent</sky-code>
      </a>
    </p>
  `,
})
export class SkyCodeTestComponent {}
