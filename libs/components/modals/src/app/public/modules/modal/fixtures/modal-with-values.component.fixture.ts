import { Component } from '@angular/core';

import { ModalTestValues } from './modal-values.fixture';

@Component({
  selector: 'sky-test-cmp-with-values',
  templateUrl: './modal-with-values.component.fixture.html'
})
export class ModalWithValuesTestComponent {
  constructor(public values: ModalTestValues) { }
}
