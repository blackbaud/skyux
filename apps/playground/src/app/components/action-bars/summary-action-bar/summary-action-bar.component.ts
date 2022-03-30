import { Component, OnDestroy } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { Subject } from 'rxjs';

import { SummaryActionBarModalComponent } from './summary-action-bar-modal.component';

@Component({
  selector: 'app-summary-action-bar',
  templateUrl: './summary-action-bar.component.html',
  styleUrls: ['./summary-action-bar.component.scss'],
})
export class SummaryActionBarComponent implements OnDestroy {
  public layout = 'vertical';

  public showSummary = true;

  private ngUnsubscribe = new Subject();

  constructor(private modalService: SkyModalService) {}

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public printHello() {
    console.log('hello');
  }

  public openModal() {
    this.modalService.open(SummaryActionBarModalComponent);
  }

  public openFullScreenModal() {
    this.modalService.open(SummaryActionBarModalComponent, {
      fullPage: true,
    });
  }

  public toggleSummary(): void {
    this.showSummary = !this.showSummary;
  }
}
