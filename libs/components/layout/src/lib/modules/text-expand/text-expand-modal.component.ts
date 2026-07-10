import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyModalModule, SkyLayoutResourcesModule],
})
export class SkyTextExpandModalComponent {
  public readonly context: SkyTextExpandModalContext = inject(
    SKY_TEXT_EXPAND_MODAL_CONTEXT,
  );
  public readonly instance = inject(SkyModalInstance);

  public close(): void {
    this.instance.close();
  }
}
