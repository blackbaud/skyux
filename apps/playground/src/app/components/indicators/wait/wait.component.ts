import { ChangeDetectorRef, Component } from '@angular/core';
import { SkyWaitService } from '@skyux/indicators';

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  standalone: false,
  styleUrl: './wait.component.css',
})
export class WaitComponent {
  public isWaiting: boolean;
  public isFullPageWaiting: boolean;
  public isServiceFullPageWaiting: boolean;
  public isNonBlocking: boolean;

  public oneThroughForty = Array.from({ length: 40 }, (_, i) => i + 1);

  #changeDetector: ChangeDetectorRef;
  #waitSvc: SkyWaitService;

  constructor(changeDetector: ChangeDetectorRef, waitSvc: SkyWaitService) {
    this.#changeDetector = changeDetector;
    this.#waitSvc = waitSvc;
  }

  public toggleFullPageWait(): void {
    this.isFullPageWaiting = !this.isFullPageWaiting;

    if (this.isFullPageWaiting) {
      setTimeout(() => {
        this.isFullPageWaiting = false;
        this.#changeDetector.markForCheck();
      }, 5000);
    }
  }

  public toggleFullPageWaitViaService(): void {
    this.isServiceFullPageWaiting = !this.isServiceFullPageWaiting;
    if (this.isServiceFullPageWaiting) {
      if (this.isNonBlocking) {
        this.#waitSvc.beginNonBlockingPageWait();
      } else {
        this.#waitSvc.beginBlockingPageWait();
      }
      setTimeout(() => {
        this.isServiceFullPageWaiting = false;
        this.#waitSvc.clearAllPageWaits();
        this.#waitSvc.dispose();
        this.#changeDetector.markForCheck();
      }, 5000);
    } else {
      this.#waitSvc.clearAllPageWaits();
      this.#waitSvc.dispose();
    }
  }
}
