import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  NgZone
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  MutationObserverService
} from '@skyux/core';

import {
  SkyTheme,
  SkyThemeService
} from '@skyux/theme';

import {
  SkyModalScrollShadowEventArgs
} from './modal-scroll-shadow-event-args';

/**
 * Raises an event when the box shadow for the modal header or footer should be adjusted
 * based on the scroll position of the host element.
 * @internal
 */
@Directive({
  selector: '[skyModalScrollShadow]'
})
export class SkyModalScrollShadowDirective implements OnInit, OnDestroy {

  @Output()
  public skyModalScrollShadow = new EventEmitter<SkyModalScrollShadowEventArgs>();

  private currentShadow: SkyModalScrollShadowEventArgs;

  private currentTheme: SkyTheme;

  private mutationObserver: MutationObserver;

  private ngUnsubscribe = new Subject<any>();

  constructor(
    private elRef: ElementRef,
    private themeSvc: SkyThemeService,
    private mutationObserverSvc: MutationObserverService,
    private ngZone: NgZone
  ) { }

  @HostListener('window:resize')
  public windowResize(): void {
    this.checkForShadow();
  }

  @HostListener('scroll')
  public scroll(): void {
    this.checkForShadow();
  }

  public ngOnInit(): void {
    this.themeSvc.settingsChange
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((themeSettings) => {
        this.currentTheme = themeSettings.currentSettings.theme;

        if (this.currentTheme === SkyTheme.presets.modern) {
          this.initMutationObserver();
        } else {
          this.emitShadow({
            bottomShadow: 'none',
            topShadow: 'none'
          });

          this.destroyMutationObserver();
        }
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.destroyMutationObserver();
  }

  private initMutationObserver(): void {
    if (!this.mutationObserver) {
      const el = this.elRef.nativeElement;

      // MutationObserver is patched by Zone.js and therefore becomes part of the
      // Angular change detection cycle, but this can lead to infinite loops in some
      // secnarios. This will keep MutationObserver from triggering change detection.
      this.ngZone.runOutsideAngular(() => {
        this.mutationObserver = this.mutationObserverSvc.create(() => {
          this.checkForShadow();
        });

        this.mutationObserver.observe(
          el,
          {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true
          }
        );
      });
    }
  }

  private destroyMutationObserver(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = undefined;
    }
  }

  private checkForShadow(): void {
    if (this.currentTheme === SkyTheme.presets.modern) {
      const el = this.elRef.nativeElement;

      const topShadow = this.buildShadowStyle(
        el.scrollTop
      );

      const bottomShadow = this.buildShadowStyle(
        (el.scrollHeight - el.scrollTop) - el.clientHeight
      );

      this.emitShadow({
        bottomShadow,
        topShadow
      });
    }
  }

  private buildShadowStyle(pixelsFromEnd: number): string {
    // Progressively darken the shadow until the user scrolls 30 pixels from the top or bottom
    // of the scrollable element, with a max opacity of 0.3.
    const opacity = Math.min(pixelsFromEnd / 30, 1) * 0.3;

    return opacity > 0 ?
      `0px 1px 8px 0px rgba(0, 0, 0, ${opacity})` :
      'none';
  }

  private emitShadow(shadow: SkyModalScrollShadowEventArgs): void {
    if (
      !this.currentShadow ||
      this.currentShadow.bottomShadow !== shadow.bottomShadow ||
      this.currentShadow.topShadow !== shadow.topShadow
    ) {
      this.skyModalScrollShadow.emit(shadow);
      this.currentShadow = shadow;
    }
  }
}
