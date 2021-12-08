import { Component } from '@angular/core';

import { SkyModalInstance } from '@skyux/modals';

import { SkyTextExpandModalContext } from './text-expand-modal-context';

/**
 * @internal
 */
@Component({
  selector: 'sky-text-expand-modal',
  templateUrl: './text-expand-modal.component.html',
  styleUrls: ['./text-expand.component.scss'],
})
export class SkyTextExpandModalComponent {
  constructor(
    public context: SkyTextExpandModalContext,
    public instance: SkyModalInstance
  ) {}

  public close(): void {
    this.instance.close();
  }
}
