import { Component } from '@angular/core';

import { ModalTestValues } from './modal-values.fixture';

@Component({
  selector: 'sky-test-cmp-with-values',
  templateUrl: './modal-with-values.component.fixture.html',
  standalone: false,
})
export class ModalWithValuesTestComponent {
  constructor(public values: ModalTestValues) {}
}
