import {
  ElementRef,
  EventEmitter,
  Injectable
} from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyTabsetAdapterService {

  public overflowChange = new EventEmitter<boolean>();

  public currentOverflow = false;

  private el: HTMLElement;

  private tabsEl: HTMLElement;

  private bntsEl: HTMLElement;

  private tabsOffsetLeft: number;

  public init(elRef: ElementRef) {
    const nativeElement = elRef.nativeElement;
    this.el = nativeElement.querySelector('.sky-tabset');
    this.tabsEl = nativeElement.querySelector('.sky-tabset-tabs');
    this.bntsEl = nativeElement.querySelector('.sky-tabset-btns');

    this.tabsOffsetLeft = this.getTabsOffsetLeft();

    this.detectOverflow();
  }

  public detectOverflow(): void {
    if (this.el && this.tabsEl) {
      let elWidth = this.el.offsetWidth;
      let tabsElWidth = this.tabsEl.offsetWidth + this.bntsEl.offsetWidth + this.tabsOffsetLeft;

      const areTabsOverflowing = (tabsElWidth > elWidth);

      if (this.currentOverflow !== areTabsOverflowing) {
        this.currentOverflow = areTabsOverflowing;
        this.overflowChange.emit(this.currentOverflow);
      }
    }
  }

  /**
   * Returns the number of pixels to the left of the first tab.
   */
  private getTabsOffsetLeft(): number {
    const tabsetRect = this.el.getBoundingClientRect();

    // The dropdown element is the first "tab" and always exists in the DOM, even when hidden.
    const firstTabRect = this.el.querySelector('.sky-tabset-dropdown').getBoundingClientRect();

    return firstTabRect.left - tabsetRect.left;
  }
}
