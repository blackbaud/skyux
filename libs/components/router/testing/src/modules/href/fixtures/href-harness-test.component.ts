import { Component } from '@angular/core';

@Component({
  selector: 'sky-href-harness-test',
  templateUrl: './href-harness-test.component.html',
  standalone: false,
})
export class HrefHarnessTestComponent {
  protected baseHref = 'my-base-href';
}
