import { Component, OnDestroy } from '@angular/core';
import { SkyKeyInfoLayoutType } from '@skyux/indicators';
import { SkyModalService } from '@skyux/modals';

import { Subject } from 'rxjs';

import { SummaryActionBarModalComponent } from './summary-action-bar-modal.component';

@Component({
  selector: 'app-summary-action-bar',
  templateUrl: './summary-action-bar.component.html',
  styleUrls: ['./summary-action-bar.component.scss'],
  standalone: false,
})
export class SummaryActionBarComponent implements OnDestroy {
  public layout: SkyKeyInfoLayoutType = 'vertical';

  public showSummary = true;

  private ngUnsubscribe = new Subject<void>();

  constructor(private modalService: SkyModalService) {}

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public printHello(): void {
    console.log('hello');
  }

  public openModal(): void {
    this.modalService.open(SummaryActionBarModalComponent, {
      size: 'large',
    });
  }

  public openFullScreenModal(): void {
    this.modalService.open(SummaryActionBarModalComponent, {
      fullPage: true,
    });
  }

  public toggleSummary(): void {
    this.showSummary = !this.showSummary;
  }
}
