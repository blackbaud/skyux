import { Component, Injectable, Input, OnDestroy, inject } from '@angular/core';
import { SkySummaryActionBarError } from '@skyux/action-bars';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';

import { SummaryActionBarModalComponent } from './summary-action-bar-modal.component';

@Injectable()
export class SABModalContext {
  public errors: SkySummaryActionBarError[] | undefined;
}

@Component({
  selector: 'app-summary-action-bar',
  templateUrl: './summary-action-bar.component.html',
  styleUrls: ['./summary-action-bar.component.scss'],
  standalone: false,
})
export class SummaryActionBarComponent implements OnDestroy {
  @Input()
  public errors: SkySummaryActionBarError[] | undefined;

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
          providers: [
            {
              provide: SABModalContext,
              useValue: {
                errors: this.errors,
              },
            },
          ],
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

  #_type: 'tab' | 'page' | 'split-view' | 'modal' | 'modal-full-page' = 'page';

  #modalInstance: SkyModalInstance | undefined;
  #modalSvc = inject(SkyModalService);

  public ngOnDestroy(): void {
    if (this.#modalInstance) {
      this.#modalInstance.close();
    }
  }
}
