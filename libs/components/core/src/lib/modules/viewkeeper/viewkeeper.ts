import { SkyViewkeeperBoundaryInfo } from './viewkeeper-boundary-info';

import { SkyViewkeeperFixedStyles } from './viewkeeper-fixed-styles';

import { SkyViewkeeperOffset } from './viewkeeper-offset';

import { SkyViewkeeperOptions } from './viewkeeper-options';

const CLS_VIEWKEEPER_FIXED = 'sky-viewkeeper-fixed';
const EVT_AFTER_VIEWKEEPER_SYNC = 'afterViewkeeperSync';

let styleEl: HTMLStyleElement;
let nextIdIndex: number;

function ensureStyleEl(): void {
  if (!styleEl) {
    styleEl = document.createElement('style');

    let css = document.createTextNode(`
.${CLS_VIEWKEEPER_FIXED} {
  position: fixed !important;
  z-index: 999;
  opacity: 0.95;
  overflow: hidden;
}

.sky-theme-modern .${CLS_VIEWKEEPER_FIXED} {
  box-shadow: 0px 1px 8px -1px rgba(0, 0, 0, 0.3);
  opacity: initial;
}
`);

    styleEl.appendChild(css);

    document.head.appendChild(styleEl);
  }
}

function nextId(): string {
  nextIdIndex = (nextIdIndex || 0) + 1;

  return 'viewkeeper-' + nextIdIndex;
}

function getOffset(
  el: HTMLElement,
  scrollableHost?: HTMLElement
): SkyViewkeeperOffset {
  const rect = el.getBoundingClientRect();
  const parent = scrollableHost ? scrollableHost : document.documentElement;

  return {
    top: rect.top + parent.scrollTop,
    left: rect.left + parent.scrollLeft,
  };
}

function px(value: number | string): string {
  let pxValue = value ? value.toString() : '';

  if (typeof value === 'number') {
    pxValue = value + 'px';
  }

  return pxValue;
}

function setElPosition(
  el: HTMLElement,
  left: number | string,
  top: number | string,
  width: number | string,
  marginTop: number | string
): void {
  el.style.top = px(top);
  el.style.left = px(left);
  el.style.marginTop = px(marginTop);

  /*istanbul ignore else*/
  /* sanity check */
  if (width !== null) {
    el.style.width = px(width);
  }
}

function getHeightWithMargin(el: HTMLElement): number {
  const computedStyle = getComputedStyle(el);

  return (
    el.offsetHeight +
    parseInt(computedStyle.marginTop, 10) +
    parseInt(computedStyle.marginBottom, 10)
  );
}

function createCustomEvent(name: any): CustomEvent<any> {
  const evt = document.createEvent('CustomEvent');

  evt.initCustomEvent(name, false, false, undefined);

  return evt;
}

export class SkyViewkeeper {
  private setWidth: boolean;

  private id: string;

  private el: HTMLElement;

  private boundaryEl: HTMLElement;

  private verticalOffset: number;

  private verticalOffsetEl: HTMLElement;

  private set viewportMarginTop(margin: number) {
    this._viewportMarginTop = margin;
  }

  private get viewportMarginTop(): number {
    if (this.scrollableHost) {
      return 0;
    } else {
      return this._viewportMarginTop;
    }
  }

  private isDestroyed: boolean;

  private currentElFixedTop: number;

  private currentElFixedLeft: number;

  private currentElFixedWidth: number;

  private scrollableHost: HTMLElement;

  private syncElPositionHandler: () => void;

  private _viewportMarginTop: number;

  constructor(options: SkyViewkeeperOptions) {
    options = options || /* istanbul ignore next */ {};

    this.setWidth = options.setWidth;
    this.id = nextId();
    this.el = options.el;
    this.boundaryEl = options.boundaryEl;
    this.scrollableHost = options.scrollableHost;
    this.verticalOffset = options.verticalOffset || 0;
    this.verticalOffsetEl = options.verticalOffsetEl;
    this.viewportMarginTop = options.viewportMarginTop || 0;

    this.syncElPositionHandler = () => this.syncElPosition();

    if (this.verticalOffsetEl) {
      this.verticalOffsetEl.addEventListener(
        EVT_AFTER_VIEWKEEPER_SYNC,
        this.syncElPositionHandler
      );
    }

    window.addEventListener('scroll', this.syncElPositionHandler, true);
    window.addEventListener('resize', this.syncElPositionHandler);
    window.addEventListener('orientationchange', this.syncElPositionHandler);

    ensureStyleEl();

    this.syncElPosition();
  }

  public syncElPosition(): void {
    const verticalOffset = this.calculateVerticalOffset();

    // When the element isn't visible, its size can't be calculated, so don't attempt syncing position in this case.
    if (this.el.offsetWidth === 0 && this.el.offsetHeight === 0) {
      return;
    }

    const boundaryInfo = this.getBoundaryInfo();
    const fixedStyles = this.getFixedStyles(boundaryInfo, verticalOffset);

    const doFixEl = this.shouldFixEl(boundaryInfo, verticalOffset);

    if (this.needsUpdating(doFixEl, fixedStyles)) {
      if (doFixEl) {
        this.fixEl(boundaryInfo, fixedStyles);
      } else {
        this.unfixEl();
      }
    }

    const evt = createCustomEvent(EVT_AFTER_VIEWKEEPER_SYNC);

    this.el.dispatchEvent(evt);
  }

  public destroy(): void {
    if (!this.isDestroyed) {
      window.removeEventListener('scroll', this.syncElPositionHandler, true);
      window.removeEventListener('resize', this.syncElPositionHandler);
      window.removeEventListener(
        'orientationchange',
        this.syncElPositionHandler
      );

      this.unfixEl();

      if (this.verticalOffsetEl) {
        this.verticalOffsetEl.removeEventListener(
          EVT_AFTER_VIEWKEEPER_SYNC,
          this.syncElPositionHandler
        );
      }

      this.el = this.boundaryEl = this.verticalOffsetEl = undefined;

      this.isDestroyed = true;
    }
  }

  private getSpacerId(): string {
    return this.id + '-spacer';
  }

  private unfixEl(): void {
    const spacerEl = document.getElementById(this.getSpacerId());

    if (spacerEl) {
      spacerEl.parentElement.removeChild(spacerEl);
    }

    this.el.classList.remove(CLS_VIEWKEEPER_FIXED);

    this.currentElFixedLeft =
      this.currentElFixedTop =
      this.currentElFixedWidth =
        undefined;

    let width: string;

    if (this.setWidth) {
      width = 'auto';
    }

    setElPosition(this.el, '', '', width, '');
  }

  private calculateVerticalOffset(): number {
    let offset = this.verticalOffset;

    if (this.verticalOffsetEl) {
      const verticalOffsetElTopStyle = this.verticalOffsetEl.style.top;
      const verticalOffsetElTop = parseInt(verticalOffsetElTopStyle, 10) || 0;

      offset += this.verticalOffsetEl.offsetHeight + verticalOffsetElTop;
    } else if (this.scrollableHost) {
      offset += this.scrollableHost.getBoundingClientRect().top;
    }

    return offset;
  }

  private shouldFixEl(
    boundaryInfo: SkyViewkeeperBoundaryInfo,
    verticalOffset: number
  ): boolean {
    let anchorTop: number;
    let doFixEl: boolean;

    if (boundaryInfo.spacerEl) {
      anchorTop = getOffset(boundaryInfo.spacerEl, this.scrollableHost).top;
    } else {
      anchorTop = getOffset(this.el, this.scrollableHost).top;
    }

    doFixEl =
      boundaryInfo.scrollTop + verticalOffset + this.viewportMarginTop >
      anchorTop;

    return doFixEl;
  }

  private getFixedStyles(
    boundaryInfo: SkyViewkeeperBoundaryInfo,
    verticalOffset: number
  ): SkyViewkeeperFixedStyles {
    let elFixedTop: number;

    // If the element needs to be fixed, this will calculate its position.  The position
    // will be 0 (fully visible) unless the user is scrolling the boundary out of view.
    // In that case, the element should begin to scroll out of view with the
    // rest of the boundary by setting its top position to a negative value.
    elFixedTop = Math.min(
      boundaryInfo.boundaryBottom -
        boundaryInfo.elHeight -
        boundaryInfo.scrollTop,
      verticalOffset
    );

    const elFixedWidth = boundaryInfo.boundaryEl.getBoundingClientRect().width;
    const elFixedLeft =
      boundaryInfo.boundaryOffset.left - boundaryInfo.scrollLeft;

    return {
      elFixedLeft,
      elFixedTop,
      elFixedWidth,
    };
  }

  private needsUpdating(
    doFixEl: boolean,
    fixedStyles: SkyViewkeeperFixedStyles
  ): boolean {
    if (
      (doFixEl &&
        this.currentElFixedLeft === fixedStyles.elFixedLeft &&
        this.currentElFixedTop === fixedStyles.elFixedTop &&
        this.currentElFixedWidth === fixedStyles.elFixedWidth) ||
      (!doFixEl &&
        !(
          this.currentElFixedLeft !== undefined &&
          this.currentElFixedLeft !== null
        ))
    ) {
      // The element is either currently fixed and its position and width do not need
      // to change, or the element is not currently fixed and does not need to be fixed.
      // No changes are needed.
      return false;
    }

    return true;
  }

  private fixEl(
    boundaryInfo: SkyViewkeeperBoundaryInfo,
    fixedStyles: SkyViewkeeperFixedStyles
  ): void {
    const el = this.el;

    /* istanbul ignore else */
    /* sanity check */
    if (!boundaryInfo.spacerEl) {
      const spacerHeight = boundaryInfo.elHeight;

      const spacerEl = document.createElement('div');
      spacerEl.id = boundaryInfo.spacerId;
      spacerEl.style.height = px(spacerHeight);

      el.parentNode.insertBefore(spacerEl, el.nextSibling);
    }

    el.classList.add(CLS_VIEWKEEPER_FIXED);

    this.currentElFixedTop = fixedStyles.elFixedTop;
    this.currentElFixedLeft = fixedStyles.elFixedLeft;
    this.currentElFixedWidth = fixedStyles.elFixedWidth;

    let width: number;

    if (this.setWidth) {
      width = fixedStyles.elFixedWidth;
    }

    setElPosition(
      el,
      fixedStyles.elFixedLeft,
      fixedStyles.elFixedTop,
      width,
      this.viewportMarginTop
    );
  }

  private getBoundaryInfo(): SkyViewkeeperBoundaryInfo {
    const spacerId = this.getSpacerId();

    const spacerEl = document.getElementById(spacerId);

    const boundaryEl = this.boundaryEl;

    const boundaryOffset = getOffset(boundaryEl, this.scrollableHost);
    const boundaryTop = boundaryOffset.top;
    const boundaryBottom =
      boundaryTop + boundaryEl.getBoundingClientRect().height;

    const scrollLeft = this.scrollableHost
      ? this.scrollableHost.scrollLeft
      : document.documentElement.scrollLeft;
    const scrollTop = this.scrollableHost
      ? this.scrollableHost.scrollTop
      : document.documentElement.scrollTop;

    const elHeight = getHeightWithMargin(this.el);

    return {
      boundaryBottom,
      boundaryOffset,
      boundaryEl,
      elHeight,
      scrollLeft,
      scrollTop,
      spacerId,
      spacerEl,
    };
  }
}
