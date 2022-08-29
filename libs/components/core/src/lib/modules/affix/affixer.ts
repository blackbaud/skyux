import { Renderer2 } from '@angular/core';

import { Observable, Subject, Subscription, fromEvent } from 'rxjs';

import { SkyAffixAutoFitContext } from './affix-auto-fit-context';
import { SkyAffixConfig } from './affix-config';
import { SkyAffixOffset } from './affix-offset';
import { SkyAffixOffsetChange } from './affix-offset-change';
import { SkyAffixPlacement } from './affix-placement';
import { SkyAffixPlacementChange } from './affix-placement-change';
import { getInversePlacement, getNextPlacement } from './affix-utils';
import {
  getElementOffset,
  getOverflowParents,
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
    return this.#_offsetChangeObs;
  }

  /**
   * Fires when the base element's nearest overflow parent is scrolling. This is useful if you need
   * to perform an additional action during the scroll event but don't want to generate another
   * event listener.
   */
  public get overflowScroll(): Observable<void> {
    return this.#_overflowScrollObs;
  }

  /**
   * Fires when the placement value changes. A `null` value indicates that a suitable
   * placement could not be found.
   */
  public get placementChange(): Observable<SkyAffixPlacementChange> {
    return this.#_placementChangeObs;
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

  #offsetChange: Subject<SkyAffixOffsetChange>;

  #overflowParents: HTMLElement[] = [];

  #overflowScroll: Subject<void>;

  #placementChange: Subject<SkyAffixPlacementChange>;

  #renderer: Renderer2;

  #resizeListener: Subscription | undefined;

  #scrollListeners: (() => void)[] | undefined;

  #_config: AffixConfigOrDefaults = DEFAULT_AFFIX_CONFIG;

  #_offsetChangeObs: Observable<SkyAffixOffsetChange>;

  #_overflowScrollObs: Observable<void>;

  #_placementChangeObs: Observable<SkyAffixPlacementChange>;

  constructor(affixedElement: HTMLElement, renderer: Renderer2) {
    this.#affixedElement = affixedElement;
    this.#renderer = renderer;

    this.#offsetChange = new Subject<SkyAffixOffsetChange>();
    this.#overflowScroll = new Subject<void>();
    this.#placementChange = new Subject<SkyAffixPlacementChange>();

    this.#_offsetChangeObs = this.#offsetChange.asObservable();
    this.#_overflowScrollObs = this.#overflowScroll.asObservable();
    this.#_placementChangeObs = this.#placementChange.asObservable();
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
      this.#addScrollListeners();
      this.#addResizeListener();
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
  }

  #affix(): void {
    const offset = this.#getOffset();

    if (this.#isNewOffset(offset)) {
      this.#renderer.setStyle(this.#affixedElement, 'top', `${offset.top}px`);
      this.#renderer.setStyle(this.#affixedElement, 'left', `${offset.left}px`);

      this.#offsetChange.next({ offset });
    }
  }

  #getOffset(): SkyAffixOffset {
    const parent = this.#getAutoFitContextParent();

    const maxAttempts = 4;
    let attempts = 0;

    let isAffixedElementFullyVisible = false;
    let offset: Required<SkyAffixOffset>;
    let placement = this.#config.placement;

    do {
      offset = this.#getPreferredOffset(placement);
      isAffixedElementFullyVisible = isOffsetFullyVisibleWithinParent(
        parent,
        offset,
        this.#config.autoFitOverflowOffset
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

    const affixedRect = this.#affixedElement.getBoundingClientRect();
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
        this.#baseElement
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
    baseElement: HTMLElement
  ): { top: number; left: number } {
    const parent = this.#getAutoFitContextParent();
    const parentOffset = getElementOffset(
      parent,
      this.#config.autoFitOverflowOffset
    );

    const affixedRect = this.#affixedElement.getBoundingClientRect();
    const baseRect = baseElement.getBoundingClientRect();

    // A pixel value representing the leeway between the edge of the overflow parent and the edge
    // of the base element before it dissapears from view.
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
    return this.#overflowParents[this.#overflowParents.length - 1];
  }

  #getAutoFitContextParent(): HTMLElement {
    const bodyElement = this.#overflowParents[0];

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
    this.#removeScrollListeners();
    this.#removeResizeListener();

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
    if (!this.#baseElement) {
      return false;
    }

    const baseRect = this.#baseElement.getBoundingClientRect();

    return isOffsetPartiallyVisibleWithinParent(
      this.#getImmediateOverflowParent(),
      {
        top: baseRect.top,
        left: baseRect.left,
        right: baseRect.right,
        bottom: baseRect.bottom,
      },
      this.#config.autoFitOverflowOffset
    );
  }

  #addScrollListeners(): void {
    this.#scrollListeners = this.#overflowParents.map((parentElement) => {
      const overflow =
        parentElement === document.body ? 'window' : parentElement;
      return this.#renderer.listen(overflow, 'scroll', () => {
        this.#affix();
        this.#overflowScroll.next();
      });
    });
  }

  #addResizeListener(): void {
    this.#resizeListener = fromEvent(window, 'resize').subscribe(() =>
      this.#affix()
    );
  }

  #removeResizeListener(): void {
    if (this.#resizeListener) {
      this.#resizeListener.unsubscribe();
      this.#resizeListener = undefined;
    }
  }

  #removeScrollListeners(): void {
    if (this.#scrollListeners) {
      // Remove renderer-generated listeners by calling the listener itself.
      // https://github.com/angular/angular/issues/9368#issuecomment-227199778
      this.#scrollListeners.forEach((listener) => listener());
      this.#scrollListeners = undefined;
    }
  }
}
