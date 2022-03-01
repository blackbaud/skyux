// #region imports
import { Component } from '@angular/core';

import { SkyToastInstance } from '../toast-instance';

import { SkyToastBodyTestContext } from './toast-body-context';

// #endregion

@Component({
  selector: 'sky-toast-body-test',
  templateUrl: './toast-body.component.fixture.html',
})
export class SkyToastBodyTestComponent {
  constructor(
    public context: SkyToastBodyTestContext,
    private instance: SkyToastInstance
  ) {}

  public close(): void {
    this.instance.close();
  }
}
