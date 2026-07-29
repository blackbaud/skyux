// #region imports
import { Component, inject } from '@angular/core';

import { SkyToastInstance } from '../toast-instance';

import { SkyToastBodyTestContext } from './toast-body-context';

// #endregion

@Component({
  selector: 'sky-toast-body-test',
  templateUrl: './toast-body.component.fixture.html',
  standalone: false,
})
export class SkyToastBodyTestComponent {
  readonly #instance = inject(SkyToastInstance);

  public readonly context = inject(SkyToastBodyTestContext);

  public close(): void {
    this.#instance.close();
  }
}
