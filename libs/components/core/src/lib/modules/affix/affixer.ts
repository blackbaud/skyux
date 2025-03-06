import { ViewportRuler } from '@angular/cdk/overlay';
import { NgZone, Renderer2 } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';

import { SkyAffixAutoFitContext } from './affix-auto-fit-context';
import { SkyAffixConfig } from './affix-config';
import { SkyAffixOffset } from './affix-offset';
import { SkyAffixOffsetChange } from './affix-offset-change';
import { SkyAffixPlacement } from './affix-placement';
import { SkyAffixPlacementChange } from './affix-placement-change';
import { AffixRect } from './affix-rect';
import { getInversePlacement, getNextPlacement } from './affix-utils';
import {
  getElementOffset,
  getOuterRect,
  getOverflowParents,
  getVisibleRectForElement,
  isOffsetFullyVisibleWithinParent,
  isOffsetPartiallyVisibleWithinParent,
} from './dom-utils';

/**
 * Make specific properties required, so that we don't have to
 * do null checks throughout this file.
 */
type AffixConfigOrDefaults = SkyAffixConfig &
  Required<
    Pick<
      SkyAffixConfig,
      | 'autoFitContext'
      | 'enableAutoFit'
      | 'horizontalAlignment'
      | 'isSticky'
      | 'placement'
    >
  >;

const DEFAULT_AFFIX_CONFIG: AffixConfigOrDefaults = {
  autoFitContext: SkyAffixAutoFitContext.OverflowParent,
  enableAutoFit: false,
  horizontalAlignment: 'center',
  isSticky: false,
  placement: 'above',
};

export class SkyAffixer {
  /**
   * Fires when the affixed element's offset changes.
   */
  public get offsetChange(): Observable<SkyAffixOffsetChange> {
    return this.#offsetChangeObs;
  }

  /**
   * Fires when the base element's nearest overflow parent is scrolling. This is useful if you need
   * to perform an additional action during the scroll event but don't want to generate another
   * event listener.
   */
  public get overflowScroll(): Observable<void> {
    return this.#overflowScrollObs;
  }

  /**
   * Fires when the placement value changes. A `null` value indicates that a suitable
   * placement could not be found.
   */
  public get placementChange(): Observable<SkyAffixPlacementChange> {
    return this.#placementChangeObs;
  }

  get #config(): AffixConfigOrDefaults {
    return this.#_config;
  }

  set #config(value: SkyAffixConfig | undefined) {
    const merged: AffixConfigOrDefaults = {
      ...DEFAULT_AFFIX_CONFIG,
      ...value,
    };

    // Make sure none of the values are undefined.
    let key: keyof typeof merged;
    for (key in merged) {
      if (merged[key] === undefined) {
        (merged as any)[key] = DEFAULT_AFFIX_CONFIG[key];
      }
    }

    this.#_config = merged;
  }

  #affixedElement: HTMLElement;

  #baseElement: HTMLElement | undefined;

  #currentOffset: SkyAffixOffset | undefined;

  #currentPlacement: SkyAffixPlacement | undefined;

  #layoutViewport: HTMLElement;

  #offsetChange: Subject<SkyAffixOffsetChange>;

  #offsetChangeObs: Observable<SkyAffixOffsetChange>;

  #overflowParents: HTMLElement[] = [];

  #overflowScroll: Subject<void>;

  #overflowScrollObs: Observable<void>;

  #placementChange: Subject<SkyAffixPlacementChange>;

  #placementChangeObs: Observable<SkyAffixPlacementChange>;

  #renderer: Renderer2;

  #scrollChange = new Subject<void>();

  #viewportListeners: Subscription | undefined;

  #viewportRuler: ViewportRuler;

  #zone: NgZone;

  #_config: AffixConfigOrDefaults = DEFAULT_AFFIX_CONFIG;

  #scrollChangeListener: () => void = () => this.#scrollChange.next();

  constructor(
    affixedElement: HTMLElement,
    renderer: Renderer2,
    viewportRuler: ViewportRuler,
    zone: NgZone,
    layoutViewport: HTMLElement,
  ) {
    this.#affixedElement = affixedElement;
    this.#renderer = renderer;
    this.#layoutViewport = layoutViewport;
    this.#viewportRuler = viewportRuler;
    this.#zone = zone;

    this.#offsetChange = new Subject<SkyAffixOffsetChange>();
    this.#overflowScroll = new Subject<void>();
    this.#placementChange = new Subject<SkyAffixPlacementChange>();

    this.#offsetChangeObs = this.#offsetChange.asObservable();
    this.#overflowScrollObs = this.#overflowScroll.asObservable();
    this.#placementChangeObs = this.#placementChange.asObservable();
  }

  /**
   * Affixes an element to a base element.
   * @param baseElement The base element.
   * @param config Configuration for the affix action.
   */
  public affixTo(baseElement: HTMLElement, config?: SkyAffixConfig): void {
    this.#reset();

    this.#config = config;
    this.#baseElement = baseElement;
    this.#overflowParents = getOverflowParents(baseElement);

    this.#affix();

    if (this.#config.isSticky) {
      this.#addViewportListeners();
    }
  }

  public getConfig(): SkyAffixConfig {
    return this.#config;
  }

  /**
   * Re-runs the affix calculation.
   */
  public reaffix(): void {
    // Reset current placement to preferred placement.
    this.#currentPlacement = this.#config.placement;
    this.#affix();
  }

  /**
   * Destroys the affixer.
   */
  public destroy(): void {
    this.#reset();
    this.#placementChange.complete();
    this.#offsetChange.complete();
    this.#overflowScroll.complete();
    this.#scrollChange.complete();
  }

  #affix(): void {
    const offset = this.#getOffset();

    const offsetParentRect = this.#getOffsetParentRect();
    offset.top = offset.top - offsetParentRect.top;
    offset.left = offset.left - offsetParentRect.left;
    offset.bottom = offset.bottom - offsetParentRect.top;
    offset.right = offset.right - offsetParentRect.left;

    if (this.#isNewOffset(offset)) {
      this.#renderer.setStyle(this.#affixedElement, 'top', `${offset.top}px`);
      this.#renderer.setStyle(this.#affixedElement, 'left', `${offset.left}px`);

      this.#offsetChange.next({ offset });
    }
  }

  #getOffsetParentRect(): AffixRect {
    // Firefox sets the offsetParent to document.body if the element uses fixed positioning.
    if (
      this.#config.position === 'absolute' &&
      this.#affixedElement.offsetParent
    ) {
      return getOuterRect(this.#affixedElement.offsetParent as HTMLElement);
    } else {
      const layoutRect = getOuterRect(this.#layoutViewport);
      return {
        top: layoutRect.top,
        left: layoutRect.left,
        height: layoutRect.height,
        width: layoutRect.width,
        bottom: layoutRect.top - layoutRect.height,
        right: layoutRect.left - layoutRect.width,
      };
    }
  }

  #getOffset(): Required<SkyAffixOffset> {
    const parent = this.#getAutoFitContextParent();

    const maxAttempts = 4;
    let attempts = 0;

    let isAffixedElementFullyVisible = false;
    let offset: Required<SkyAffixOffset>;
    let placement = this.#config.placement;

    do {
      offset = this.#getPreferredOffset(placement);
      isAffixedElementFullyVisible = isOffsetFullyVisibleWithinParent(
        this.#viewportRuler,
        parent,
        offset,
        this.#config.autoFitOverflowOffset,
      );

      if (!this.#config.enableAutoFit) {
        break;
      }

      if (!isAffixedElementFullyVisible) {
        placement =
          attempts % 2 === 0
            ? getInversePlacement(placement)
            : getNextPlacement(placement);
      }

      attempts++;
    } while (!isAffixedElementFullyVisible && attempts < maxAttempts);

    if (isAffixedElementFullyVisible) {
      if (this.#isBaseElementVisible()) {
        this.#notifyPlacementChange(placement);
      } else {
        this.#notifyPlacementChange(null);
      }

      return offset;
    }

    if (this.#config.enableAutoFit) {
      this.#notifyPlacementChange(null);
    }

    // No suitable placement was found, so revert to preferred placement.
    return this.#getPreferredOffset(this.#config.placement);
  }

  #getPreferredOffset(placement: SkyAffixPlacement): Required<SkyAffixOffset> {
    if (!this.#baseElement) {
      return { top: 0, left: 0, bottom: 0, right: 0 };
    }

    const affixedRect = getOuterRect(this.#affixedElement);
    const baseRect = this.#baseElement.getBoundingClientRect();

    const horizontalAlignment = this.#config.horizontalAlignment;
    const verticalAlignment = this.#config.verticalAlignment;
    const enableAutoFit = this.#config.enableAutoFit;

    let top: number;
    let left: number;

    if (placement === 'above' || placement === 'below') {
      if (placement === 'above') {
        top = baseRect.top - affixedRect.height;

        switch (verticalAlignment) {
          case 'top':
            top = top + affixedRect.height;
            break;
          case 'middle':
            top = top + affixedRect.height / 2;
            break;
          case 'bottom':
          default:
            break;
        }
      } else {
        top = baseRect.bottom;

        switch (verticalAlignment) {
          case 'top':
          default:
            break;
          case 'middle':
            top = top - affixedRect.height / 2;
            break;
          case 'bottom':
            top = top - affixedRect.height;
            break;
        }
      }

      switch (horizontalAlignment) {
        case 'left':
          left = baseRect.left;
          break;

        case 'center':
        default:
          left = baseRect.left + baseRect.width / 2 - affixedRect.width / 2;
          break;

        case 'right':
          left = baseRect.right - affixedRect.width;
          break;
      }
    } else {
      if (placement === 'left') {
        left = baseRect.left - affixedRect.width;
      } else {
        left = baseRect.right;
      }

      switch (verticalAlignment) {
        case 'top':
          top = baseRect.top;
          break;

        case 'middle':
        default:
          top = baseRect.top + baseRect.height / 2 - affixedRect.height / 2;
          break;

        case 'bottom':
          top = baseRect.bottom - affixedRect.height;
          break;
      }
    }

    const offset: Required<SkyAffixOffset> = { top, left, bottom: 0, right: 0 };

    if (enableAutoFit) {
      const adjustments = this.#adjustOffsetToOverflowParent(
        { top, left },
        placement,
        this.#baseElement,
      );
      offset.top = adjustments.top;
      offset.left = adjustments.left;
    }

    offset.bottom = offset.top + affixedRect.height;
    offset.right = offset.left + affixedRect.width;

    return offset;
  }

  /**
   * Slightly adjust the offset to fit within the scroll parent's boundaries if
   * the affixed element would otherwise be clipped.
   */
  #adjustOffsetToOverflowParent(
    offset: { top: number; left: number },
    placement: SkyAffixPlacement,
    baseElement: HTMLElement,
  ): { top: number; left: number } {
    const affixedRect = getOuterRect(this.#affixedElement);
    const baseRect = baseElement.getBoundingClientRect();

    const parent = this.#getAutoFitContextParent();
    let parentOffset: Required<SkyAffixOffset>;
    if (this.#config.autoFitContext === SkyAffixAutoFitContext.OverflowParent) {
      if (this.#config.autoFitOverflowOffset) {
        // When the config contains a specific offset.
        parentOffset = getElementOffset(
          parent,
          this.#config.autoFitOverflowOffset,
        );
      } else if (
        isOffsetFullyVisibleWithinParent(this.#viewportRuler, parent, baseRect)
      ) {
        // When the base element is fully visible within the parent, aim for the visible portion of the parent element.
        parentOffset = getVisibleRectForElement(this.#viewportRuler, parent);
      } else {
        // Anywhere in the parent element.
        parentOffset = getOuterRect(parent);
      }
    } else {
      const viewportRect = this.#viewportRuler.getViewportRect();
      parentOffset = {
        top: -viewportRect.top,
        left: -viewportRect.left,
        bottom: viewportRect.height + viewportRect.top,
        right: viewportRect.width + viewportRect.left,
      };
    }

    // A pixel value representing the leeway between the edge of the overflow parent and the edge
    // of the base element before it disappears from view.
    // If the visible portion of the base element is less than this pixel value, the auto-fit
    // functionality attempts to find another placement.
    const defaultPixelTolerance = 40;
    let pixelTolerance: number;

    const originalOffsetTop = offset.top;
    const originalOffsetLeft = offset.left;

    switch (placement) {
      case 'above':
      case 'below':
        // Keep the affixed element within the overflow parent.
        if (offset.left < parentOffset.left) {
          offset.left = parentOffset.left;
        } else if (offset.left + affixedRect.width > parentOffset.right) {
          offset.left = parentOffset.right - affixedRect.width;
        }

        // Use a smaller pixel tolerance if the base element width is less than the default.
        pixelTolerance = Math.min(defaultPixelTolerance, baseRect.width);

        // Make sure the affixed element never detaches from the base element.
        if (
          offset.left + pixelTolerance > baseRect.right ||
          offset.left + affixedRect.width - pixelTolerance < baseRect.left
        ) {
          offset.left = originalOffsetLeft;
        }

        break;

      case 'left':
      case 'right':
        // Keep the affixed element within the overflow parent.
        if (offset.top < parentOffset.top) {
          offset.top = parentOffset.top;
        } else if (offset.top + affixedRect.height > parentOffset.bottom) {
          offset.top = parentOffset.bottom - affixedRect.height;
        }

        // Use a smaller pixel tolerance if the base element height is less than the default.
        pixelTolerance = Math.min(defaultPixelTolerance, baseRect.height);

        // Make sure the affixed element never detaches from the base element.
        if (
          offset.top + pixelTolerance > baseRect.bottom ||
          offset.top + affixedRect.height - pixelTolerance < baseRect.top
        ) {
          offset.top = originalOffsetTop;
        }

        break;
    }

    return offset;
  }

  #getImmediateOverflowParent(): HTMLElement {
    return this.#overflowParents[0];
  }

  #getAutoFitContextParent(): HTMLElement {
    const bodyElement = this.#overflowParents[this.#overflowParents.length - 1];

    return this.#config.autoFitContext === SkyAffixAutoFitContext.OverflowParent
      ? this.#getImmediateOverflowParent()
      : bodyElement;
  }

  #notifyPlacementChange(placement: SkyAffixPlacement | null): void {
    if (this.#currentPlacement !== placement) {
      this.#currentPlacement = placement ?? undefined;
      this.#placementChange.next({
        placement,
      });
    }
  }

  #reset(): void {
    this.#removeViewportListeners();

    this.#overflowParents = [];

    this.#config =
      this.#baseElement =
      this.#currentPlacement =
      this.#currentOffset =
        undefined;
  }

  #isNewOffset(offset: SkyAffixOffset): boolean {
    if (this.#currentOffset === undefined) {
      this.#currentOffset = offset;
      return true;
    }

    if (
      this.#currentOffset.top === offset.top &&
      this.#currentOffset.left === offset.left
    ) {
      return false;
    }

    this.#currentOffset = offset;

    return true;
  }

  #isBaseElementVisible(): boolean {
    // Can't get here if the base element is undefined.
    /* istanbul ignore if */
    if (!this.#baseElement) {
      return false;
    }

    const baseRect = this.#baseElement.getBoundingClientRect();

    return isOffsetPartiallyVisibleWithinParent(
      this.#viewportRuler,
      this.#getImmediateOverflowParent(),
      {
        top: baseRect.top,
        left: baseRect.left,
        right: baseRect.right,
        bottom: baseRect.bottom,
      },
      this.#config.autoFitOverflowOffset,
    );
  }

  #addViewportListeners(): void {
    this.#viewportListeners = new Subscription();

    // Resize and orientation changes.
    this.#viewportListeners.add(
      this.#viewportRuler.change().subscribe(() => {
        this.#affix();
      }),
    );

    this.#viewportListeners.add(
      this.#scrollChange.subscribe(() => {
        this.#affix();
        this.#overflowScroll.next();
      }),
    );

    // Listen for scroll events on the window, visual viewport, and any overflow parents.
    // https://developer.chrome.com/blog/visual-viewport-api/#events-only-fire-when-the-visual-viewport-changes
    this.#zone.runOutsideAngular(() => {
      [window, window.visualViewport, ...this.#overflowParents].forEach(
        (parentElement) => {
          parentElement?.addEventListener('scroll', this.#scrollChangeListener);
        },
      );
    });
  }

  #removeViewportListeners(): void {
    this.#viewportListeners?.unsubscribe();

    this.#zone.runOutsideAngular(() => {
      [window, window.visualViewport, ...this.#overflowParents].forEach(
        (parentElement) => {
          parentElement?.removeEventListener(
            'scroll',
            this.#scrollChangeListener,
          );
        },
      );
    });
  }
}
