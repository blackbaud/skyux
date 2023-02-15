import { Component, OnDestroy } from '@angular/core';
import { SkyModalService } from '@skyux/modals';
import { SkyAppViewportService } from '@skyux/theme';

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

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private modalService: SkyModalService,
    viewportSvc: SkyAppViewportService
  ) {
    // Use this to test how secondary actions collapse into a dropdown.
    // The larger the size, the fewer secondary actions it takes to
    // collapse to a dropdown.
    viewportSvc.reserveSpace({
      id: 'summary-action-bar-test',
      position: 'left',
      size: 0,
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public printHello() {
    console.log('hello');
  }

  public openModal() {
    this.modalService.open(SummaryActionBarModalComponent, {
      size: 'large',
    });
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
