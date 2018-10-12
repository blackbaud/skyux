// #region imports
import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyToastType
} from '../types/toast-type';

import {
  SkyToastComponent
} from '../toast.component';
// #endregion

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './toast.component.fixture.html'
})
export class SkyToastTestComponent {
  public toastType: SkyToastType;

  @ViewChild(SkyToastComponent)
  public toastComponent: SkyToastComponent;

  public onClosed(): void { }
}
