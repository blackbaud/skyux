import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ModalTestContext } from './modal-context';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './modal.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ModalTestComponent {
  public longContent = false;

  protected context = inject(ModalTestContext, { optional: true });
}
