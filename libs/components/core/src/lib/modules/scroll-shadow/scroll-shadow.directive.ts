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

interface BoxShadowInfo {
  colorParts: string;
  lengths: string;
  opacity: number;
}

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
  #boxShadows: BoxShadowInfo[] | 'none' | undefined;

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

  #splitBoxShadowDetails(boxShadow: string): BoxShadowInfo | undefined {
    const colorRegex =
      /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/;
    const match = boxShadow.match(colorRegex);

    if (match) {
      const colorParts = `${match[1]}, ${match[2]}, ${match[3]}`; // Extract RGB values as a comma-separated string
      const opacity = match[4] ? parseFloat(match[4]) : 1; // Use the captured opacity or default to 1
      const lengths = boxShadow.replace(match[0], '').trim(); // Remove the color from the rest

      return { colorParts, opacity, lengths };
    }

    /* istanbul ignore next */
    return;
  }

  #formatBoxShadows(boxShadowString: string): BoxShadowInfo[] {
    const boxShadows: BoxShadowInfo[] = [];
    let currentShadow = '';
    let openParentheses = 0;

    for (const char of boxShadowString) {
      if (char === ',' && openParentheses === 0) {
        const details = this.#splitBoxShadowDetails(currentShadow.trim());
        if (details) {
          boxShadows.push(details);
        }

        currentShadow = '';
      } else {
        currentShadow += char;
        if (char === '(') {
          openParentheses++;
        } else if (char === ')') {
          openParentheses--;
        }
      }
    }

    if (currentShadow.trim()) {
      const details = this.#splitBoxShadowDetails(currentShadow.trim());
      if (details) {
        boxShadows.push(details);
      }
    }

    return boxShadows;
  }

  #getBoxShadowInfo(): BoxShadowInfo[] {
    const elStyles = window.getComputedStyle(this.#elRef.nativeElement);
    const boxShadowStyle = elStyles.getPropertyValue(
      '--sky-elevation-overflow',
    );

    // Creating a temporary element and setting box shadow converts the color in the box shadows to rgba or rgb
    const tempEl = document.createElement('div');
    tempEl.style.setProperty('box-shadow', boxShadowStyle);

    const convertedBoxShadows = tempEl.style.getPropertyValue('box-shadow');
    const boxShadows = this.#formatBoxShadows(convertedBoxShadows);

    return boxShadows;
  }

  #buildShadowStyle(pixelsFromEnd: number): string {
    if (!this.#boxShadows) {
      const boxShadowInfo = this.#getBoxShadowInfo();
      if (boxShadowInfo.length > 0) {
        this.#boxShadows = boxShadowInfo;
      } else {
        this.#boxShadows = 'none';
      }
    }

    const boxShadowStyles: string[] = [];

    if (this.#boxShadows === 'none' || pixelsFromEnd === 0) {
      return 'none';
    } else {
      for (const shadow of this.#boxShadows) {
        const { colorParts, lengths, opacity } = shadow;
        // Progressively darken the shadow until the user scrolls 30 pixels from the top or bottom
        // of the scrollable element, with a max opacity of 0.3.
        const adjustedOpacity = Math.min(pixelsFromEnd / 30, 1) * opacity;
        const adjustedShadow = `${lengths} rgba(${colorParts}, ${adjustedOpacity})`;
        boxShadowStyles.push(adjustedShadow);
      }
      return boxShadowStyles.join(', ');
    }
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
