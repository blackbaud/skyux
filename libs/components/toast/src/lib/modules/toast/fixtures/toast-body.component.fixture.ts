// #region imports
import { Component } from '@angular/core';

import { SkyToastInstance } from '../toast-instance';

import { SkyToastBodyTestContext } from './toast-body-context';

// #endregion

@Component({
  selector: 'sky-toast-body-test',
  templateUrl: './toast-body.component.fixture.html',
  standalone: false,
})
export class SkyToastBodyTestComponent {
  #instance: SkyToastInstance;

  constructor(
    public context: SkyToastBodyTestContext,
    instance: SkyToastInstance,
  ) {
    this.#instance = instance;
  }

  public close(): void {
    this.#instance.close();
  }
}
