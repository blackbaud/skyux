import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  Output,
  inject,
} from '@angular/core';

import { Subject } from 'rxjs';

import { SkyMutationObserverService } from '../mutation/mutation-observer-service';

import { SkyScrollShadowEventArgs } from './scroll-shadow-event-args';

/**
 * Raises an event when the box shadow for a component's header or footer should be adjusted
 * based on the scroll position of the host element.
 * @internal
 */
@Directive({
  standalone: true,
  selector: '[skyScrollShadow]',
})
export class SkyScrollShadowDirective implements OnDestroy {
  @Input()
  public set skyScrollShadowEnabled(value: boolean) {
    this.#_enabled = value;

    if (value) {
      this.#initMutationObserver();
    } else {
      this.#emitShadow({
        bottomShadow: 'none',
        topShadow: 'none',
      });

      this.#destroyMutationObserver();
    }
  }

  public get skyScrollShadowEnabled(): boolean {
    return this.#_enabled;
  }

  @Output()
  public skyScrollShadow = new EventEmitter<SkyScrollShadowEventArgs>();

  #currentShadow: SkyScrollShadowEventArgs | undefined;

  #mutationObserver: MutationObserver | undefined;

  #ngUnsubscribe = new Subject<void>();

  readonly #elRef = inject(ElementRef);
  readonly #mutationObserverSvc = inject(SkyMutationObserverService);
  readonly #ngZone = inject(NgZone);

  #_enabled = false;

  @HostListener('window:resize')
  public windowResize(): void {
    this.#checkForShadow();
  }

  @HostListener('scroll')
  public scroll(): void {
    this.#checkForShadow();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    this.#destroyMutationObserver();
  }

  #initMutationObserver(): void {
    if (!this.#mutationObserver) {
      const el = this.#elRef.nativeElement;

      // MutationObserver is patched by Zone.js and therefore becomes part of the
      // Angular change detection cycle, but this can lead to infinite loops in some
      // scenarios. This will keep MutationObserver from triggering change detection.
      this.#ngZone.runOutsideAngular(() => {
        this.#mutationObserver = this.#mutationObserverSvc.create(() => {
          this.#checkForShadow();
        });

        this.#mutationObserver.observe(el, {
          attributes: true,
          characterData: true,
          childList: true,
          subtree: true,
        });
      });
    }
  }

  #destroyMutationObserver(): void {
    if (this.#mutationObserver) {
      this.#mutationObserver.disconnect();
      this.#mutationObserver = undefined;
    }
  }

  #checkForShadow(): void {
    if (this.skyScrollShadowEnabled) {
      const el: Element = this.#elRef.nativeElement;

      const topShadow = this.#buildShadowStyle(el.scrollTop);

      const bottomShadow = this.#buildShadowStyle(
        el.scrollHeight - el.scrollTop - el.clientHeight,
      );

      this.#emitShadow({
        bottomShadow,
        topShadow,
      });
    }
  }

  #buildShadowStyle(pixelsFromEnd: number): string {
    // Progressively darken the shadow until the user scrolls 30 pixels from the top or bottom
    // of the scrollable element, with a max opacity of 0.3.
    const opacity = Math.min(pixelsFromEnd / 30, 1) * 0.3;

    return opacity > 0 ? `0px 1px 8px 0px rgba(0, 0, 0, ${opacity})` : 'none';
  }

  #emitShadow(shadow: SkyScrollShadowEventArgs): void {
    if (
      !this.#currentShadow ||
      this.#currentShadow.bottomShadow !== shadow.bottomShadow ||
      this.#currentShadow.topShadow !== shadow.topShadow
    ) {
      this.skyScrollShadow.emit(shadow);
      this.#currentShadow = shadow;
    }
  }
}
