import { SkyViewkeeperBoundaryInfo } from './viewkeeper-boundary-info';
import { SkyViewkeeperFixedStyles } from './viewkeeper-fixed-styles';
import { SkyViewkeeperOffset } from './viewkeeper-offset';
import { SkyViewkeeperOptions } from './viewkeeper-options';

const CLS_VIEWKEEPER_FIXED = 'sky-viewkeeper-fixed';
const CLS_VIEWKEEPER_FIXED_NOT_LAST = 'sky-viewkeeper-fixed-not-last';
const CLS_VIEWKEEPER_BOUNDARY = 'sky-viewkeeper-boundary';
const EVT_AFTER_VIEWKEEPER_SYNC = 'afterViewkeeperSync';

let nextIdIndex: number;

function nextId(): string {
  nextIdIndex = (nextIdIndex || 0) + 1;

  return 'viewkeeper-' + nextIdIndex;
}

function getOffset(
  el: HTMLElement,
  scrollableHost?: HTMLElement,
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
  marginTop: number | string,
  marginTopProperty: string | undefined,
  clipTop: number | string,
  clipLeft: number | string,
): void {
  el.style.top = px(top);
  el.style.left = px(left);
  el.style.marginTop = marginTopProperty
    ? `calc(${px(marginTop)} + var(${marginTopProperty}, 0px))`
    : px(marginTop);
  el.style.clipPath =
    clipTop || clipLeft ? `inset(${px(clipTop)} 0 0 ${px(clipLeft)})` : 'none';

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
  #boundaryEl: HTMLElement | undefined;

  #el: HTMLElement | undefined;

  #id: string;

  #setWidth: boolean;

  #verticalOffset: number;

  #verticalOffsetEl: HTMLElement | undefined;

  #viewportMarginTop = 0;

  #viewportMarginProperty: `--${string}` | undefined;

  #currentElFixedLeft: number | undefined;

  #currentElFixedTop: number | undefined;

  #currentElFixedWidth: number | undefined;

  #currentElClipLeft: number | undefined;

  #currentElClipTop: number | undefined;

  #isDestroyed = false;

  #scrollableHost: HTMLElement | undefined;

  #syncElPositionHandler: () => void;

  #intersectionObserver: IntersectionObserver | undefined;

  #spacerResizeObserver: ResizeObserver | undefined;

  constructor(options: SkyViewkeeperOptions) {
    options = options || /* istanbul ignore next */ {};

    this.#el = options.el;
    this.#boundaryEl = options.boundaryEl;

    if (!this.#el) {
      throw new Error('[SkyViewkeeper] The option `el` is required.');
    }

    if (!this.#boundaryEl) {
      throw new Error('[SkyViewkeeper] The option `boundaryEl` is required.');
    }

    const el = this.#el;
    const boundaryEl = this.#boundaryEl;

    this.#setWidth = !!options.setWidth;
    this.#id = nextId();
    this.#scrollableHost = options.scrollableHost;
    this.#verticalOffset = options.verticalOffset || 0;
    this.#verticalOffsetEl = options.verticalOffsetEl;

    // Only set viewport margin if the scrollable host is undefined.
    if (!this.#scrollableHost) {
      this.#viewportMarginTop = options.viewportMarginTop ?? 0;
      this.#viewportMarginProperty = options.viewportMarginProperty;
    }

    this.#syncElPositionHandler = (): void =>
      this.syncElPosition(el, boundaryEl);

    if (this.#verticalOffsetEl) {
      this.#verticalOffsetEl.addEventListener(
        EVT_AFTER_VIEWKEEPER_SYNC,
        this.#syncElPositionHandler,
      );
    }

    window.addEventListener('scroll', this.#syncElPositionHandler, true);
    window.addEventListener('resize', this.#syncElPositionHandler);
    window.addEventListener('orientationchange', this.#syncElPositionHandler);

    this.#boundaryEl.classList.add(CLS_VIEWKEEPER_BOUNDARY);

    this.syncElPosition(el, boundaryEl);
  }

  public syncElPosition(el: HTMLElement, boundaryEl: HTMLElement): void {
    const verticalOffset = this.#calculateVerticalOffset();

    // When the element isn't visible, its size can't be calculated, so don't attempt syncing position in this case.
    if (this.#isDestroyed || (el.offsetWidth === 0 && el.offsetHeight === 0)) {
      return;
    }

    const boundaryInfo = this.#getBoundaryInfo(el, boundaryEl);
    const fixedStyles = this.#getFixedStyles(boundaryInfo, verticalOffset);

    const doFixEl = this.#shouldFixEl(el, boundaryInfo, verticalOffset);

    if (this.#needsUpdating(doFixEl, fixedStyles)) {
      if (doFixEl) {
        this.#fixEl(el, boundaryInfo, fixedStyles);
        this.#verticalOffsetEl?.classList.add(CLS_VIEWKEEPER_FIXED_NOT_LAST);
      } else {
        this.#unfixEl(el);
        this.#verticalOffsetEl?.classList.remove(CLS_VIEWKEEPER_FIXED_NOT_LAST);
      }
    }

    const evt = createCustomEvent(EVT_AFTER_VIEWKEEPER_SYNC);

    el.dispatchEvent(evt);
  }

  public destroy(): void {
    if (!this.#isDestroyed) {
      this.#intersectionObserver?.disconnect();
      window.removeEventListener('scroll', this.#syncElPositionHandler, true);
      window.removeEventListener('resize', this.#syncElPositionHandler);
      window.removeEventListener(
        'orientationchange',
        this.#syncElPositionHandler,
      );

      if (this.#el) {
        this.#unfixEl(this.#el);
      }

      this.#verticalOffsetEl?.removeEventListener(
        EVT_AFTER_VIEWKEEPER_SYNC,
        this.#syncElPositionHandler,
      );
      this.#verticalOffsetEl?.classList.remove(CLS_VIEWKEEPER_FIXED_NOT_LAST);

      this.#spacerResizeObserver?.disconnect();
      this.#boundaryEl?.classList.remove(CLS_VIEWKEEPER_BOUNDARY);

      this.#el =
        this.#boundaryEl =
        this.#verticalOffsetEl =
        this.#intersectionObserver =
        this.#spacerResizeObserver =
          undefined;

      this.#isDestroyed = true;
    }
  }

  #getSpacerId(): string {
    return this.#id + '-spacer';
  }

  #unfixEl(el: HTMLElement): void {
    const spacerEl = document.getElementById(this.#getSpacerId());

    if (spacerEl) {
      this.#spacerResizeObserver?.unobserve(spacerEl);

      /*istanbul ignore else*/
      if (spacerEl.parentElement) {
        spacerEl.parentElement.removeChild(spacerEl);
      }
    }

    el.classList.remove(CLS_VIEWKEEPER_FIXED);

    this.#currentElFixedLeft =
      this.#currentElFixedTop =
      this.#currentElFixedWidth =
        undefined;

    let width = '';

    if (this.#setWidth) {
      width = 'auto';
    }

    setElPosition(el, '', '', width, '', '', 0, 0);
  }

  #calculateVerticalOffset(): number {
    let offset = this.#verticalOffset;

    if (this.#verticalOffsetEl) {
      const verticalOffsetElTopStyle = this.#verticalOffsetEl.style.top;
      const verticalOffsetElTop = parseInt(verticalOffsetElTopStyle, 10) || 0;

      offset += this.#verticalOffsetEl.offsetHeight + verticalOffsetElTop;
    } else if (this.#scrollableHost) {
      offset += this.#scrollableHost.getBoundingClientRect().top;
    }

    return offset;
  }

  #shouldFixEl(
    el: HTMLElement,
    boundaryInfo: SkyViewkeeperBoundaryInfo,
    verticalOffset: number,
  ): boolean {
    let anchorTop: number;

    if (boundaryInfo.spacerEl) {
      anchorTop = getOffset(boundaryInfo.spacerEl, this.#scrollableHost).top;
    } else {
      anchorTop = getOffset(el, this.#scrollableHost).top;
    }

    let viewportMarginTop = this.#viewportMarginTop;
    const viewportMarginProperty =
      this.#viewportMarginProperty &&
      getComputedStyle(document.body).getPropertyValue(
        this.#viewportMarginProperty,
      );
    if (viewportMarginProperty) {
      viewportMarginTop += parseInt(viewportMarginProperty, 10);
    }

    const doFixEl =
      boundaryInfo.scrollTop + verticalOffset + viewportMarginTop > anchorTop;

    return doFixEl;
  }

  #getFixedStyles(
    boundaryInfo: SkyViewkeeperBoundaryInfo,
    verticalOffset: number,
  ): SkyViewkeeperFixedStyles {
    // If the element needs to be fixed, this will calculate its position.  The position
    // will be 0 (fully visible) unless the user is scrolling the boundary out of view.
    // In that case, the element should begin to scroll out of view with the
    // rest of the boundary by setting its top position to a negative value.
    const elTop =
      boundaryInfo.boundaryBottom -
      boundaryInfo.elHeight -
      boundaryInfo.scrollTop;
    const elClipTop = elTop < verticalOffset ? verticalOffset - elTop : 0;
    const elFixedTop = Math.min(elTop, verticalOffset);

    const elFixedWidth = boundaryInfo.boundaryEl.getBoundingClientRect().width;
    const elFixedLeft =
      boundaryInfo.boundaryOffset.left - boundaryInfo.scrollLeft;
    const elClipLeft = elFixedLeft < 0 ? 0 - elFixedLeft : 0;

    return {
      elFixedLeft,
      elFixedTop,
      elFixedWidth,
      elClipLeft,
      elClipTop,
    };
  }

  #needsUpdating(
    doFixEl: boolean,
    fixedStyles: SkyViewkeeperFixedStyles,
  ): boolean {
    if (
      (doFixEl &&
        this.#currentElFixedLeft === fixedStyles.elFixedLeft &&
        this.#currentElFixedTop === fixedStyles.elFixedTop &&
        this.#currentElClipLeft === fixedStyles.elClipLeft &&
        this.#currentElClipTop === fixedStyles.elClipTop &&
        this.#currentElFixedWidth === fixedStyles.elFixedWidth) ||
      (!doFixEl &&
        !(
          this.#currentElFixedLeft !== undefined &&
          this.#currentElFixedLeft !== null
        ))
    ) {
      // The element is either currently fixed and its position and width do not need
      // to change, or the element is not currently fixed and does not need to be fixed.
      // No changes are needed.
      return false;
    }

    return true;
  }

  #fixEl(
    el: HTMLElement,
    boundaryInfo: SkyViewkeeperBoundaryInfo,
    fixedStyles: SkyViewkeeperFixedStyles,
  ): void {
    /* istanbul ignore else */
    /* sanity check */
    if (!boundaryInfo.spacerEl) {
      const spacerHeight = boundaryInfo.elHeight;

      const spacerEl = document.createElement('div');
      spacerEl.id = boundaryInfo.spacerId;
      spacerEl.style.height = px(spacerHeight);

      /*istanbul ignore else*/
      if (el.parentNode) {
        el.parentNode.insertBefore(spacerEl, el.nextSibling);
      }

      if (!this.#spacerResizeObserver) {
        this.#spacerResizeObserver = new ResizeObserver(() =>
          this.#syncElPositionHandler(),
        );
      }

      this.#spacerResizeObserver.observe(spacerEl);
    }

    el.classList.add(CLS_VIEWKEEPER_FIXED);

    this.#currentElFixedTop = fixedStyles.elFixedTop;
    this.#currentElFixedLeft = fixedStyles.elFixedLeft;
    this.#currentElClipTop = fixedStyles.elClipTop;
    this.#currentElClipLeft = fixedStyles.elClipLeft;
    this.#currentElFixedWidth = fixedStyles.elFixedWidth;

    let width = 0;

    if (this.#setWidth) {
      width = fixedStyles.elFixedWidth;
    }

    setElPosition(
      el,
      fixedStyles.elFixedLeft,
      fixedStyles.elFixedTop,
      width,
      this.#viewportMarginTop,
      this.#viewportMarginProperty,
      fixedStyles.elClipTop,
      fixedStyles.elClipLeft,
    );
  }

  #getBoundaryInfo(
    el: HTMLElement,
    boundaryEl: HTMLElement,
  ): SkyViewkeeperBoundaryInfo {
    const spacerId = this.#getSpacerId();

    const spacerEl = document.getElementById(spacerId);

    const boundaryOffset = getOffset(boundaryEl, this.#scrollableHost);
    const boundaryTop = boundaryOffset.top;
    const boundaryBottom =
      boundaryTop + boundaryEl.getBoundingClientRect().height;

    const scrollLeft = this.#scrollableHost
      ? this.#scrollableHost.scrollLeft
      : document.documentElement.scrollLeft;
    const scrollTop = this.#scrollableHost
      ? this.#scrollableHost.scrollTop
      : document.documentElement.scrollTop;

    const elHeight = getHeightWithMargin(el);

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
