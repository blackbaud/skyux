import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { SkyTheme, SkyThemeService } from '@skyux/theme';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class SkyScrollShadowDirective implements OnInit, OnDestroy {
  @Output()
  public skyScrollShadow = new EventEmitter<SkyScrollShadowEventArgs>();

  #currentShadow: SkyScrollShadowEventArgs | undefined;

  #currentTheme: SkyTheme | undefined;

  #mutationObserver: MutationObserver | undefined;

  #ngUnsubscribe = new Subject<void>();

  readonly #elRef = inject(ElementRef);
  readonly #mutationObserverSvc = inject(SkyMutationObserverService);
  readonly #ngZone = inject(NgZone);
  readonly #themeSvc = inject(SkyThemeService, { optional: true });

  @HostListener('window:resize')
  public windowResize(): void {
    this.#checkForShadow();
  }

  @HostListener('scroll')
  public scroll(): void {
    this.#checkForShadow();
  }

  public ngOnInit(): void {
    if (this.#themeSvc) {
      this.#themeSvc.settingsChange
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((themeSettings) => {
          this.#currentTheme = themeSettings.currentSettings.theme;

          if (this.#currentTheme === SkyTheme.presets.modern) {
            this.#initMutationObserver();
          } else {
            this.#emitShadow({
              bottomShadow: 'none',
              topShadow: 'none',
            });

            this.#destroyMutationObserver();
          }
        });
    }
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
    if (this.#currentTheme === SkyTheme.presets.modern) {
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
