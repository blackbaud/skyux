import { Component } from '@angular/core';

import { SkyModalError } from '../modal-error';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './modal-footer.component.fixture.html',
  standalone: false,
})
export class ModalFooterTestComponent {
  public errors: SkyModalError[] | undefined;
}
