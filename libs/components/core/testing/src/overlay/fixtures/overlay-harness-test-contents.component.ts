import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-overlay-harness-contents',
  template: `<ul>
      <li class="li-foo">Foo</li>
      <li class="li-bar">Bar</li>
      <li class="li-baz">Baz</li>
    </ul>
    <test-overlay-child>OVERLAY CHILD 1 CONTENT</test-overlay-child>
    <test-overlay-child>OVERLAY CHILD 2 CONTENT</test-overlay-child>`,
})
export class OverlayHarnessTestContentsComponent {}
