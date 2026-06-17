import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { SkyWaitService } from '@skyux/indicators';

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './wait.component.css',
})
export class WaitComponent {
  public isWaiting: boolean;
  public isFullPageWaiting: boolean;
  public isServiceFullPageWaiting: boolean;
  public isNonBlocking: boolean;

  public oneThroughForty = Array.from({ length: 40 }, (_, i) => i + 1);

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #waitSvc = inject(SkyWaitService);

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
