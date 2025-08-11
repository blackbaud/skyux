import { ViewportRuler } from '@angular/cdk/scrolling';
import { Renderer2 } from '@angular/core';

import {
  Observable,
  Subject,
  Subscription,
  debounceTime,
  fromEvent,
  merge,
  takeUntil,
} from 'rxjs';

import { SkyAffixAutoFitContext } from './affix-auto-fit-context';
import type { SkyAffixConfig } from './affix-config';
import type { SkyAffixOffset } from './affix-offset';
import { SkyAffixOffsetChange } from './affix-offset-change';
import { SkyAffixPlacement } from './affix-placement';
import { SkyAffixPlacementChange } from './affix-placement-change';
import type { AffixRect } from './affix-rect';
import {
  getElementOffset,
  getOuterRect,
  getOverflowParents,
  getVisibleRectForElement,
  isOffsetFullyVisibleWithinParent,
  isOffsetPartiallyVisibleWithinParent,
} from './dom-utils';

// Performance constants
const SCROLL_DEBOUNCE_TIME = 10; // ms
const DEFAULT_PIXEL_TOLERANCE = 40;

// Interfaces for internal use
interface PlacementCandidate {
  placement: SkyAffixPlacement;
  offset: Required<SkyAffixOffset>;
  isFullyVisible: boolean;
  availableSpace: number;
}

interface CachedRects {
  affixed: AffixRect;
  base: DOMRect;
  parent: Required<SkyAffixOffset>;
}

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

interface CachedRects {
  affixed: AffixRect;
  base: DOMRect;
  parent: Required<SkyAffixOffset>;
}

interface PlacementCandidate {
  placement: SkyAffixPlacement;
  offset: Required<SkyAffixOffset>;
  isFullyVisible: boolean;
  availableSpace: number;
}

export class SkyAffixer {
  /**
   * Fires when the affixed element's offset changes.
   */
  public get offsetChange(): Observable<SkyAffixOffsetChange> {
    return this.#offsetChangeSubject.asObservable();
  }

  /**
   * Fires when the base element's nearest overflow parent is scrolling. This is useful if you need
   * to perform an additional action during the scroll event but don't want to generate another
   * event listener.
   */
  public get overflowScroll(): Observable<void> {
    return this.#overflowScrollSubject.asObservable();
  }

  /**
   * Fires when the placement value changes. A `null` value indicates that a suitable
   * placement could not be found.
   */
  public get placementChange(): Observable<SkyAffixPlacementChange> {
    return this.#placementChangeSubject.asObservable();
  }

  // Private fields
  readonly #affixedElement: HTMLElement;
  readonly #renderer: Renderer2;
  readonly #viewportRuler: ViewportRuler;
  readonly #layoutViewport: HTMLElement;

  // Subjects for event emission
  readonly #offsetChangeSubject = new Subject<SkyAffixOffsetChange>();
  readonly #overflowScrollSubject = new Subject<void>();
  readonly #placementChangeSubject = new Subject<SkyAffixPlacementChange>();
  readonly #destroySubject = new Subject<void>();

  // Current state
  #config: AffixConfigOrDefaults = DEFAULT_AFFIX_CONFIG;
  #baseElement: HTMLElement | undefined;
  #overflowParents: HTMLElement[] = [];
  #currentOffset: SkyAffixOffset | undefined;
  #currentPlacement: SkyAffixPlacement | undefined;
  #viewportSubscription: Subscription | undefined;

  constructor(
    affixedElement: HTMLElement,
    renderer: Renderer2,
    viewportRuler: ViewportRuler,
    layoutViewport: HTMLElement,
  ) {
    this.#affixedElement = affixedElement;
    this.#renderer = renderer;
    this.#layoutViewport = layoutViewport;
    this.#viewportRuler = viewportRuler;
  }

  /**
   * Affixes an element to a base element.
   * @param baseElement The base element.
   * @param config Configuration for the affix action.
   */
  public affixTo(baseElement: HTMLElement, config?: SkyAffixConfig): void {
    this.#validateInputs(baseElement);
    this.#reset();
    this.#initialize(baseElement, config);
    this.#performAffix();

    if (this.#config.isSticky) {
      this.#setupStickyListeners();
    }
  }

  public getConfig(): SkyAffixConfig {
    return { ...this.#config };
  }

  /**
   * Re-runs the affix calculation.
   */
  public reaffix(): void {
    if (!this.#baseElement) {
      return;
    }

    // Reset current placement to preferred placement
    this.#currentPlacement = this.#config.placement;
    this.#performAffix();
  }

  /**
   * Destroys the affixer.
   */
  public destroy(): void {
    this.#reset();
    this.#destroySubject.next();
    this.#destroySubject.complete();
    this.#offsetChangeSubject.complete();
    this.#overflowScrollSubject.complete();
    this.#placementChangeSubject.complete();
  }

  // Private implementation methods

  #validateInputs(baseElement: HTMLElement): void {
    if (!baseElement || !baseElement.getBoundingClientRect) {
      throw new Error('Base element must be a valid HTMLElement');
    }
  }

  #initialize(baseElement: HTMLElement, config?: SkyAffixConfig): void {
    this.#config = this.#mergeConfig(config);
    this.#baseElement = baseElement;
    this.#overflowParents = getOverflowParents(baseElement);
  }

  #mergeConfig(config?: SkyAffixConfig): AffixConfigOrDefaults {
    return {
      ...DEFAULT_AFFIX_CONFIG,
      ...config,
    };
  }

  #performAffix(): void {
    const offset = this.#calculateOptimalOffset();
    const adjustedOffset = this.#adjustForOffsetParent(offset);

    if (this.#hasOffsetChanged(adjustedOffset)) {
      this.#applyOffset(adjustedOffset);
      this.#emitOffsetChange(adjustedOffset);
    }
  }

  #calculateOptimalOffset(): Required<SkyAffixOffset> {
    if (!this.#baseElement) {
      return { top: 0, left: 0, bottom: 0, right: 0 };
    }

    if (!this.#config.enableAutoFit) {
      return this.#calculateOffsetForPlacement(this.#config.placement);
    }

    return this.#findBestPlacementWithAutoFit();
  }

  #findBestPlacementWithAutoFit(): Required<SkyAffixOffset> {
    const candidates = this.#generatePlacementCandidates();
    const bestCandidate = this.#selectBestPlacementCandidate(candidates);

    if (bestCandidate?.isFullyVisible && this.#isBaseElementVisible()) {
      this.#emitPlacementChange(bestCandidate.placement);
      return bestCandidate.offset;
    }

    this.#emitPlacementChange(null);

    // Fall back to preferred placement if no good options found
    return this.#calculateOffsetForPlacement(this.#config.placement);
  }

  #generatePlacementCandidates(): PlacementCandidate[] {
    const placements: SkyAffixPlacement[] = ['above', 'below', 'left', 'right'];
    const candidates: PlacementCandidate[] = [];

    for (const placement of placements) {
      const offset = this.#calculateOffsetForPlacement(placement);
      const isFullyVisible = this.#isOffsetFullyVisible(offset);
      const availableSpace = this.#calculateAvailableSpace(placement);

      candidates.push({
        placement,
        offset,
        isFullyVisible,
        availableSpace,
      });
    }

    return candidates;
  }

  #selectBestPlacementCandidate(
    candidates: PlacementCandidate[],
  ): PlacementCandidate | null {
    // First priority: fully visible candidates
    const visibleCandidates = candidates.filter((c) => c.isFullyVisible);
    if (visibleCandidates.length > 0) {
      // Prefer the configured placement if it's fully visible
      const preferredCandidate = visibleCandidates.find(
        (c) => c.placement === this.#config.placement,
      );
      if (preferredCandidate) {
        return preferredCandidate;
      }
      // Otherwise, choose the one with most available space
      return visibleCandidates.reduce((best, current) =>
        current.availableSpace > best.availableSpace ? current : best,
      );
    }

    // Second priority: candidate with most available space
    return candidates.reduce((best, current) =>
      current.availableSpace > best.availableSpace ? current : best,
    );
  }

  #calculateOffsetForPlacement(
    placement: SkyAffixPlacement,
  ): Required<SkyAffixOffset> {
    if (!this.#baseElement) {
      return { top: 0, left: 0, bottom: 0, right: 0 };
    }

    const cachedRects = this.#getCachedRects();
    const baseRect = cachedRects.base;
    const affixedRect = cachedRects.affixed;

    let top: number;
    let left: number;

    if (placement === 'above' || placement === 'below') {
      top = this.#calculateVerticalPosition(placement, baseRect, affixedRect);
      left = this.#calculateHorizontalAlignment(baseRect, affixedRect);
    } else {
      left = this.#calculateHorizontalPosition(
        placement,
        baseRect,
        affixedRect,
      );
      top = this.#calculateVerticalAlignment(baseRect, affixedRect);
    }

    const offset: Required<SkyAffixOffset> = {
      top,
      left,
      bottom: top + affixedRect.height,
      right: left + affixedRect.width,
    };

    return this.#config.enableAutoFit
      ? this.#adjustOffsetForOverflow(offset, placement)
      : offset;
  }

  #calculateVerticalPosition(
    placement: SkyAffixPlacement,
    baseRect: DOMRect,
    affixedRect: AffixRect,
  ): number {
    const verticalAlignment = this.#config.verticalAlignment;

    if (placement === 'above') {
      const top = baseRect.top - affixedRect.height;

      switch (verticalAlignment) {
        case 'top':
          return top + affixedRect.height;
        case 'middle':
          return top + affixedRect.height / 2;
        case 'bottom':
        default:
          return top;
      }
    } else {
      // 'below'
      const top = baseRect.bottom;

      switch (verticalAlignment) {
        case 'top':
        default:
          return top;
        case 'middle':
          return top - affixedRect.height / 2;
        case 'bottom':
          return top - affixedRect.height;
      }
    }
  }

  #calculateHorizontalPosition(
    placement: SkyAffixPlacement,
    baseRect: DOMRect,
    affixedRect: AffixRect,
  ): number {
    return placement === 'left'
      ? baseRect.left - affixedRect.width
      : baseRect.right;
  }

  #calculateHorizontalAlignment(
    baseRect: DOMRect,
    affixedRect: AffixRect,
  ): number {
    switch (this.#config.horizontalAlignment) {
      case 'left':
        return baseRect.left;
      case 'right':
        return baseRect.right - affixedRect.width;
      case 'center':
      default:
        return baseRect.left + (baseRect.width - affixedRect.width) / 2;
    }
  }

  #calculateVerticalAlignment(
    baseRect: DOMRect,
    affixedRect: AffixRect,
  ): number {
    const verticalAlignment = this.#config.verticalAlignment;

    switch (verticalAlignment) {
      case 'top':
        return baseRect.top;
      case 'bottom':
        return baseRect.bottom - affixedRect.height;
      case 'middle':
      default:
        return baseRect.top + (baseRect.height - affixedRect.height) / 2;
    }
  }

  #adjustOffsetForOverflow(
    offset: Required<SkyAffixOffset>,
    placement: SkyAffixPlacement,
  ): Required<SkyAffixOffset> {
    if (!this.#baseElement) {
      return offset;
    }

    const cachedRects = this.#getCachedRects();
    const adjustedOffset = { ...offset };
    const pixelTolerance = this.#calculatePixelTolerance(
      placement,
      cachedRects.base,
    );

    if (placement === 'above' || placement === 'below') {
      this.#adjustHorizontalOverflow(
        adjustedOffset,
        cachedRects,
        pixelTolerance,
      );
    } else {
      this.#adjustVerticalOverflow(adjustedOffset, cachedRects, pixelTolerance);
    }

    return adjustedOffset;
  }

  #adjustHorizontalOverflow(
    offset: Required<SkyAffixOffset>,
    rects: CachedRects,
    pixelTolerance: number,
  ): void {
    const originalLeft = offset.left;
    const parentOffset = rects.parent;

    // Keep within parent bounds
    if (offset.left < parentOffset.left) {
      offset.left = parentOffset.left;
    } else if (offset.right > parentOffset.right) {
      offset.left = parentOffset.right - rects.affixed.width;
    }

    // Ensure we don't detach from base element
    const wouldDetach =
      offset.left + pixelTolerance > rects.base.right ||
      offset.left + rects.affixed.width - pixelTolerance < rects.base.left;

    if (wouldDetach) {
      offset.left = originalLeft;
    }

    // Update right coordinate
    offset.right = offset.left + rects.affixed.width;
  }

  #adjustVerticalOverflow(
    offset: Required<SkyAffixOffset>,
    rects: CachedRects,
    pixelTolerance: number,
  ): void {
    const originalTop = offset.top;
    const parentOffset = rects.parent;

    // Keep within parent bounds
    if (offset.top < parentOffset.top) {
      offset.top = parentOffset.top;
    } else if (offset.bottom > parentOffset.bottom) {
      offset.top = parentOffset.bottom - rects.affixed.height;
    }

    // Ensure we don't detach from base element
    const wouldDetach =
      offset.top + pixelTolerance > rects.base.bottom ||
      offset.top + rects.affixed.height - pixelTolerance < rects.base.top;

    if (wouldDetach) {
      offset.top = originalTop;
    }

    // Update bottom coordinate
    offset.bottom = offset.top + rects.affixed.height;
  }

  #getCachedRects(): CachedRects {
    if (!this.#baseElement) {
      throw new Error('Base element is required for rect calculations');
    }

    return {
      affixed: getOuterRect(this.#affixedElement),
      base: this.#baseElement.getBoundingClientRect(),
      parent: this.#getParentOffset(),
    };
  }

  #getParentOffset(): Required<SkyAffixOffset> {
    const parent = this.#getAutoFitContextParent();

    if (this.#config.autoFitContext === SkyAffixAutoFitContext.OverflowParent) {
      if (this.#config.autoFitOverflowOffset) {
        return getElementOffset(parent, this.#config.autoFitOverflowOffset);
      } else if (
        this.#baseElement &&
        this.#isBaseElementFullyVisibleInParent(parent)
      ) {
        return getVisibleRectForElement(this.#viewportRuler, parent);
      } else {
        return getOuterRect(parent);
      }
    } else {
      const viewportRect = this.#viewportRuler.getViewportRect();
      return {
        top: -viewportRect.top,
        left: -viewportRect.left,
        bottom: viewportRect.height + viewportRect.top,
        right: viewportRect.width + viewportRect.left,
      };
    }
  }

  #calculatePixelTolerance(
    placement: SkyAffixPlacement,
    baseRect: DOMRect,
  ): number {
    const baseDimension =
      placement === 'above' || placement === 'below'
        ? baseRect.width
        : baseRect.height;

    return Math.min(DEFAULT_PIXEL_TOLERANCE, baseDimension);
  }

  #calculateAvailableSpace(placement: SkyAffixPlacement): number {
    if (!this.#baseElement) {
      return 0;
    }

    const baseRect = this.#baseElement.getBoundingClientRect();
    const parentOffset = this.#getParentOffset();

    switch (placement) {
      case 'above':
        return baseRect.top - parentOffset.top;
      case 'below':
        return parentOffset.bottom - baseRect.bottom;
      case 'left':
        return baseRect.left - parentOffset.left;
      case 'right':
        return parentOffset.right - baseRect.right;
      default:
        return 0;
    }
  }

  #isOffsetFullyVisible(offset: Required<SkyAffixOffset>): boolean {
    const parent = this.#getAutoFitContextParent();
    return isOffsetFullyVisibleWithinParent(
      this.#viewportRuler,
      parent,
      offset,
      this.#config.autoFitOverflowOffset,
    );
  }

  #isBaseElementVisible(): boolean {
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

  #isBaseElementFullyVisibleInParent(parent: HTMLElement): boolean {
    if (!this.#baseElement) {
      return false;
    }

    const baseRect = this.#baseElement.getBoundingClientRect();
    return isOffsetFullyVisibleWithinParent(
      this.#viewportRuler,
      parent,
      baseRect,
    );
  }

  #adjustForOffsetParent(
    offset: Required<SkyAffixOffset>,
  ): Required<SkyAffixOffset> {
    const offsetParentRect = this.#getOffsetParentRect();

    return {
      top: offset.top - offsetParentRect.top,
      left: offset.left - offsetParentRect.left,
      bottom: offset.bottom - offsetParentRect.top,
      right: offset.right - offsetParentRect.left,
    };
  }

  #getOffsetParentRect(): AffixRect {
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

  #hasOffsetChanged(offset: Required<SkyAffixOffset>): boolean {
    if (!this.#currentOffset) {
      this.#currentOffset = offset;
      return true;
    }

    const hasChanged =
      this.#currentOffset.top !== offset.top ||
      this.#currentOffset.left !== offset.left;

    if (hasChanged) {
      this.#currentOffset = offset;
    }

    return hasChanged;
  }

  #applyOffset(offset: Required<SkyAffixOffset>): void {
    this.#renderer.setStyle(this.#affixedElement, 'top', `${offset.top}px`);
    this.#renderer.setStyle(this.#affixedElement, 'left', `${offset.left}px`);
  }

  #emitOffsetChange(offset: Required<SkyAffixOffset>): void {
    this.#offsetChangeSubject.next({ offset });
  }

  #emitPlacementChange(placement: SkyAffixPlacement | null): void {
    if (this.#currentPlacement !== placement) {
      this.#currentPlacement = placement ?? undefined;
      this.#placementChangeSubject.next({ placement });
    }
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

  #setupStickyListeners(): void {
    if (this.#viewportSubscription) {
      this.#viewportSubscription.unsubscribe();
    }

    this.#viewportSubscription = new Subscription();

    // Viewport resize and orientation changes
    this.#viewportSubscription.add(
      this.#viewportRuler
        .change()
        .pipe(takeUntil(this.#destroySubject))
        .subscribe(() => this.#performAffix()),
    );

    // Scroll events with debouncing for performance
    const scrollEvents = merge(
      fromEvent(window, 'scroll'),
      fromEvent(window.visualViewport || window, 'scroll'),
      ...this.#overflowParents.map((parent) => fromEvent(parent, 'scroll')),
    );

    this.#viewportSubscription.add(
      scrollEvents
        .pipe(
          debounceTime(SCROLL_DEBOUNCE_TIME),
          takeUntil(this.#destroySubject),
        )
        .subscribe(() => {
          this.#performAffix();
          this.#overflowScrollSubject.next();
        }),
    );
  }

  #reset(): void {
    this.#viewportSubscription?.unsubscribe();
    this.#viewportSubscription = undefined;
    this.#overflowParents = [];
    this.#baseElement = undefined;
    this.#currentPlacement = undefined;
    this.#currentOffset = undefined;
    this.#config = DEFAULT_AFFIX_CONFIG;
  }
}
