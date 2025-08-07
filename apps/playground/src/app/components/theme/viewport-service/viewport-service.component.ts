import { DOCUMENT, NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyWaitService } from '@skyux/indicators';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyAppViewportService } from '@skyux/theme';

@Component({
  selector: 'app-viewport-service',
  imports: [SkyToolbarModule, SkyViewkeeperModule, NgClass],
  templateUrl: './viewport-service.component.html',
  styleUrl: './viewport-service.component.css',
})
export default class ViewportServiceComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  protected readonly envBar = viewChild<ElementRef<HTMLDivElement>>('devBar');
  protected readonly hideEnvBar = model(false);
  protected readonly toolbarRegion =
    viewChild<ElementRef<HTMLDivElement>>('toolbarRegion');
  protected readonly viewKeep = signal(['.floating-bar', '.toolbar']);

  readonly #document = inject(DOCUMENT);
  readonly #ngZone = inject(NgZone);
  readonly #intersectionObserver = this.#ngZone.runOutsideAngular(
    () =>
      new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) =>
          this.#ngZone.run(() => {
            const viewKeep = ['.floating-bar'];
            if (
              entries[0].isIntersecting &&
              entries[0].intersectionRect.height > 102
            ) {
              viewKeep.push('.toolbar');
            }
            this.viewKeep.set(viewKeep);
          }),
        {
          root: this.#document.getElementById('content'),
          threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        },
      ),
  );
  readonly #viewportService = inject(SkyAppViewportService);
  readonly #waitSvc = inject(SkyWaitService);

  public ngOnInit(): void {
    this.startWaiting();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.#viewportService.reserveSpace({
        id: 'dev-bar',
        position: 'top',
        size: 50,
        reserveForElement: this.envBar().nativeElement,
      });
      this.#intersectionObserver.observe(this.toolbarRegion().nativeElement);
    }, 501);
  }

  public ngOnDestroy(): void {
    this.#viewportService.unreserveSpace('left-test');
    this.#viewportService.unreserveSpace('top-test');
    this.#waitSvc.dispose();
  }

  protected startWaiting(): void {
    this.#waitSvc.beginBlockingPageWait();
    setTimeout(() => this.#waitSvc.endBlockingPageWait(), 5000);
  }
}
