import { Component, Input, OnDestroy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';
import { FontLoadingService } from '@skyux/storybook/font-loading';

import { SummaryActionBarModalComponent } from './summary-action-bar-modal.component';

@Component({
  selector: 'app-summary-action-bar',
  templateUrl: './summary-action-bar.component.html',
  styleUrls: ['./summary-action-bar.component.scss'],
  standalone: false,
})
export class SummaryActionBarComponent implements OnDestroy {
  @Input()
  public set type(
    value: 'tab' | 'page' | 'split-view' | 'modal' | 'modal-full-page',
  ) {
    this.#_type = value;

    if (value.startsWith('modal')) {
      this.#modalInstance = this.#modalSvc.open(
        SummaryActionBarModalComponent,
        {
          fullPage: value.endsWith('full-page'),
        },
      );
    }
  }

  public get type():
    | 'tab'
    | 'page'
    | 'split-view'
    | 'modal'
    | 'modal-full-page' {
    return this.#_type;
  }

  public readonly readyFonts = toSignal(inject(FontLoadingService).ready());
  public readonly readyIcons = toSignal(inject(FontLoadingService).ready(true));

  #_type: 'tab' | 'page' | 'split-view' | 'modal' | 'modal-full-page' = 'page';

  #modalInstance: SkyModalInstance | undefined;
  #modalSvc = inject(SkyModalService);

  public ngOnDestroy(): void {
    if (this.#modalInstance) {
      this.#modalInstance.close();
    }
  }
}
