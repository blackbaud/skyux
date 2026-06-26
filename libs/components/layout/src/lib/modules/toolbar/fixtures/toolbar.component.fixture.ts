import { Component, input } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './toolbar.component.fixture.html',
  standalone: false,
})
export class SkyToolbarTestComponent {
  public listDescriptor = input<string | undefined>(undefined);
}
