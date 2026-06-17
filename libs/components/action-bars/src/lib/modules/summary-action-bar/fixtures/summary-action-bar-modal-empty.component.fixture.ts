import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';

import { SkySummaryActionBarModalTestComponent } from './summary-action-bar-modal.component.fixture';

@Component({
  selector: 'sky-test-cmp-modal',
  templateUrl: './summary-action-bar-modal-empty.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkySummaryActionBarModalEmptyTestComponent implements OnDestroy {
  #modal: SkyModalInstance | undefined;
  readonly #modalService = inject(SkyModalService);

  public ngOnDestroy(): void {
    this.#modal?.close();
    this.#modalService.dispose();
  }

  public openModal(): void {
    this.#modal = this.#modalService.open(
      SkySummaryActionBarModalTestComponent,
    );
  }
}
