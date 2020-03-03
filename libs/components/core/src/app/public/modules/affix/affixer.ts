import {
  Renderer2
} from '@angular/core';

import {
  Observable,
  Subject,
  Subscription
} from 'rxjs';

import 'rxjs/add/observable/fromEvent';

import {
  SkyAffixOffset
} from './affix-offset';

import {
  SkyAffixConfig
} from './affix-config';

import {
  SkyAffixPlacement
} from './affix-placement';

import {
  SkyAffixPlacementChange
} from './affix-placement-change';

import {
  getInversePlacement,
  getNextPlacement
} from './affix-utils';

import {
  getImmediateScrollableParent,
  getElementOffset,
  getScrollableParents,
  isOffsetVisibleWithinParent
} from './dom-utils';

const DEFAULT_AFFIX_CONFIG: SkyAffixConfig = {
  enableAutoFit: false,
  horizontalAlignment: 'center',
  isSticky: false,
  placement: 'above',
  verticalAlignment: 'middle'
};

export class SkyAffixer {

  /**
   * Fires when the placement value changes. A `null` value indicates that a suitable
   * placement could not be found.
   */
  public get placementChange(): Observable<SkyAffixPlacementChange> {
    return this._placementChange.asObservable();
  }

  private get config(): SkyAffixConfig {
    return this._config;
  }

  private set config(value: SkyAffixConfig) {
    const merged = {...DEFAULT_AFFIX_CONFIG, ...value};

    // Make sure none of the values are undefined.
    Object.keys(merged).forEach((k: keyof SkyAffixConfig) => {
      if (merged[k] === undefined) {
        (merged as any)[k] = DEFAULT_AFFIX_CONFIG[k];
      }
    });

    this._config = merged;
  }

  private affixedRect: ClientRect;

  private baseElement: HTMLElement;

  private baseRect: ClientRect;

  private currentPlacement: SkyAffixPlacement;

  private resizeListener: Subscription;

  private scrollableParents: HTMLElement[];

  private scrollListeners: Function[];

  private _config: SkyAffixConfig;

  private _placementChange = new Subject<SkyAffixPlacementChange>();

  constructor(
    private affixedElement: HTMLElement,
    private renderer: Renderer2
  ) { }

  /**
   * Affixes an element to a base element.
   * @param baseElement The base element.
   * @param config Configuration for the affix action.
   */
  public affixTo(baseElement: HTMLElement, config?: SkyAffixConfig): void {

    this.reset();

    this.config = config;
    this.baseElement = baseElement;
    this.scrollableParents = getScrollableParents(baseElement);

    this.affix();

    if (this.config.isSticky) {
      this.addScrollListeners();
      this.addResizeListener();
    }
  }

  /**
   * Destroys the affixer.
   */
  public destroy(): void {
    this.reset();
    this._placementChange.complete();
    this._placementChange = undefined;
  }

  private affix(): void {
    this.baseRect = this.baseElement.getBoundingClientRect();
    this.affixedRect = this.affixedElement.getBoundingClientRect();

    const { top, left } = this.getOffset();

    this.renderer.setStyle(this.affixedElement, 'top', `${top}px`);
    this.renderer.setStyle(this.affixedElement, 'left', `${left}px`);
  }

  private getOffset(): SkyAffixOffset {
    const parent = getImmediateScrollableParent(this.scrollableParents);

    const maxAttempts = 4;
    let attempts = 0;

    let isAffixedElementFullyVisible = false;
    let offset: SkyAffixOffset;
    let placement = this.config.placement;

    do {
      offset = this.getPreferredOffset(placement);
      isAffixedElementFullyVisible = isOffsetVisibleWithinParent(parent, offset);

      if (!this.config.enableAutoFit) {
        break;
      }

      if (!isAffixedElementFullyVisible) {
        placement = (attempts % 2 === 0)
          ? getInversePlacement(placement)
          : getNextPlacement(placement);
      }

      attempts++;
    } while (!isAffixedElementFullyVisible && attempts < maxAttempts);

    if (isAffixedElementFullyVisible) {
      this.emitPlacementChange(placement);
      return offset;
    }

    /* tslint:disable-next-line:no-null-keyword */
    this.emitPlacementChange(null);

    // No suitable placement was found, so revert to preferred placement.
    return this.getPreferredOffset(this.config.placement);
  }

  private getPreferredOffset(placement: SkyAffixPlacement): SkyAffixOffset {
    const affixedRect = this.affixedRect;
    const baseRect = this.baseRect;

    const horizontalAlignment = this.config.horizontalAlignment;
    const verticalAlignment = this.config.verticalAlignment;
    const enableAutoFit = this.config.enableAutoFit;

    let top: number;
    let left: number;

    if (placement === 'above' || placement === 'below') {
      if (placement === 'above') {
        top = baseRect.top - affixedRect.height;
      } else {
        top = baseRect.bottom;
      }

      switch (horizontalAlignment) {
        case 'left':
          left = baseRect.left;
          break;

        case 'center':
          default:
            left = baseRect.left + (baseRect.width / 2) - (affixedRect.width / 2);
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
          top = baseRect.top + (baseRect.height / 2) - (affixedRect.height / 2);
          break;

        case 'bottom':
          top = baseRect.bottom - affixedRect.height;
          break;
      }
    }

    let offset: SkyAffixOffset = { left, top };
    if (enableAutoFit) {
      offset = this.adjustOffsetToScrollableParent({...offset}, placement);
    }

    offset.bottom = offset.top + affixedRect.height;
    offset.right = offset.left + affixedRect.width;

    return offset;
  }

  /**
   * Slightly adjust the offset to fit within the scroll parent's boundaries if
   * the affixed element would otherwise be clipped.
   */
  private adjustOffsetToScrollableParent(
    offset: SkyAffixOffset,
    placement: SkyAffixPlacement
  ): SkyAffixOffset {
    const parent = getImmediateScrollableParent(this.scrollableParents);
    const parentOffset = getElementOffset(parent);

    const affixedRect = this.affixedRect;
    const baseRect = this.baseRect;

    /* tslint:disable-next-line:switch-default */
    switch (placement) {
      case 'above':
      case 'below':
        if (offset.left < parentOffset.left) {
          offset.left = parentOffset.left;
        } else if (offset.left + affixedRect.width > parentOffset.right) {
          offset.left = parentOffset.right - affixedRect.width;
        }

        // Make sure the affixed element never detaches from the base element.
        if (offset.left > baseRect.left) {
          offset.left = baseRect.left;
        } else if (offset.left + affixedRect.width < baseRect.right) {
          offset.left = baseRect.right - affixedRect.width;
        }
        break;

      case 'left':
      case 'right':
        if (offset.top < parentOffset.top) {
          offset.top = parentOffset.top;
        } else if (offset.top + affixedRect.height > parentOffset.bottom) {
          offset.top = parentOffset.bottom - affixedRect.height;
        }

        // Make sure the affixed element never detaches from the base element.
        if (offset.top > baseRect.top) {
          offset.top = baseRect.top;
        } else if (offset.top + affixedRect.height < baseRect.bottom) {
          offset.top = baseRect.bottom - affixedRect.height;
        }
        break;
    }

    return offset;
  }

  private emitPlacementChange(placement: SkyAffixPlacement | null): void {
    if (this.currentPlacement !== placement) {
      this.currentPlacement = placement;
      this._placementChange.next({
        placement
      });
    }
  }

  private reset(): void {
    this.removeScrollListeners();
    this.removeResizeListener();

    this._config =
      this.affixedRect =
      this.baseElement =
      this.baseRect =
      this.scrollableParents = undefined;
  }

  private addScrollListeners(): void {
    this.scrollListeners = this.scrollableParents.map((parentElement) => {
      const scrollable = (parentElement === document.body) ? 'window' : parentElement;
      return this.renderer.listen(scrollable, 'scroll', () => this.affix());
    });
  }

  private addResizeListener(): void {
    this.resizeListener = Observable.fromEvent(window, 'resize')
      .subscribe(() => this.affix());
  }

  private removeResizeListener(): void {
    if (this.resizeListener) {
      this.resizeListener.unsubscribe();
      this.resizeListener = undefined;
    }
  }

  private removeScrollListeners(): void {
    if (this.scrollListeners) {
      // Remove renderer-generated listeners by calling the listener itself.
      // https://github.com/angular/angular/issues/9368#issuecomment-227199778
      this.scrollListeners.forEach(listener => listener());
      this.scrollListeners = undefined;
    }
  }

}
