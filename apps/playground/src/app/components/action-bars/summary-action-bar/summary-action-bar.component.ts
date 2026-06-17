import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import { SkySummaryActionBarError } from '@skyux/action-bars';
import { SkyKeyInfoLayoutType } from '@skyux/indicators';
import { SkyModalService } from '@skyux/modals';

import { Subject } from 'rxjs';

import { SummaryActionBarModalComponent } from './summary-action-bar-modal.component';

@Component({
  selector: 'app-summary-action-bar',
  templateUrl: './summary-action-bar.component.html',
  styleUrls: ['./summary-action-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SummaryActionBarComponent implements OnDestroy {
  public layout: SkyKeyInfoLayoutType = 'vertical';

  public showSummary = true;

  private ngUnsubscribe = new Subject<void>();
  public error: SkySummaryActionBarError[] = [
    {
      message: 'Error number 1',
    },
    {
      message: 'Error number 2',
    },
  ];

  readonly #modalService = inject(SkyModalService);

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public printHello(): void {
    console.log('hello');
  }

  public openModal(): void {
    this.#modalService.open(SummaryActionBarModalComponent, {
      size: 'large',
    });
  }

  public openFullScreenModal(): void {
    this.#modalService.open(SummaryActionBarModalComponent, {
      fullPage: true,
    });
  }

  public toggleSummary(): void {
    this.showSummary = !this.showSummary;
  }
}
