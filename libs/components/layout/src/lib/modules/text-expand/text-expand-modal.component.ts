import { Component, Inject } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

import { SkyTextExpandModalContext } from './text-expand-modal-context';
import { SKY_TEXT_EXPAND_MODAL_CONTEXT } from './text-expand-modal-context-token';

/**
 * @internal
 */
@Component({
  selector: 'sky-text-expand-modal',
  templateUrl: './text-expand-modal.component.html',
  styleUrls: ['./text-expand.component.scss'],
  imports: [SkyModalModule, SkyLayoutResourcesModule],
})
export class SkyTextExpandModalComponent {
  constructor(
    @Inject(SKY_TEXT_EXPAND_MODAL_CONTEXT)
    public context: SkyTextExpandModalContext,
    public instance: SkyModalInstance,
  ) {}

  public close(): void {
    this.instance.close();
  }
}
