import { Component } from '@angular/core';
import { SkyOverlayInstance } from '@skyux/core';

@Component({
  selector: 'test-overlay-harness-contents',
  template: `<ul>
    <li>Foo</li>
    <li>Bar</li>
    <li>Baz</li>
  </ul> `,
})
export class OverlayHarnessTestContentsComponent {
  public id: string;

  constructor(instance: SkyOverlayInstance) {
    this.id = instance.id;
  }
}
