import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Renderer2
} from '@angular/core';

import {
  StacheOmnibarAdapterService
} from '../shared/omnibar-adapter.service';

import {
  StacheWindowRef
} from '../shared/window-ref';

@Directive({
  selector: '[stacheAffixTop]'
})
export class StacheAffixTopDirective implements AfterViewInit {
  public static readonly AFFIX_CLASS_NAME: string = 'stache-affix-top';
  public isAffixed = false;

  private footerWrapper: HTMLElement;
  private omnibarHeight = 0;
  private offsetTop = 0;
  private element: HTMLElement;

  constructor (
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private omnibarService: StacheOmnibarAdapterService,
    private windowRef: StacheWindowRef) { }

  public ngAfterViewInit(): void {
    this.footerWrapper = this.windowRef.nativeWindow.document.querySelector('.stache-footer-wrapper');
    const nativeElement = this.elementRef.nativeElement;

    if (this.isComponent(nativeElement) && nativeElement.children[0]) {
      this.element = nativeElement.children[0];
    } else {
      this.element = nativeElement;
    }
  }

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    this.omnibarHeight = this.omnibarService.getHeight();
    this.setMaxHeight();

    if (!this.isAffixed) {
      this.offsetTop = this.getOffset(this.element);
    }

    const windowIsScrolledBeyondElement =
      ((this.offsetTop - this.omnibarHeight) <= this.windowRef.nativeWindow.pageYOffset);

    if (windowIsScrolledBeyondElement) {
      this.affixToTop();
    } else {
      this.resetElement();
    }
  }

  private isComponent(element: any): boolean {
    let isComponent = false;

    Array.prototype.slice.call(element.attributes)
      .forEach((item: any) => {
        if (!isComponent && item.name.indexOf('_nghost') === 0) {
          isComponent = true;
        }
      });

    return isComponent;
  }

  private getOffset(element: any) {
    let offset = element.offsetTop;
    let el = element;

    while (el.offsetParent) {
      offset += el.offsetParent.offsetTop;
      el = el.offsetParent;
    }

    return offset;
  }

  private affixToTop(): void {
    if (!this.isAffixed) {
      this.isAffixed = true;
      this.renderer.setStyle(this.element, 'position', 'fixed');
      this.renderer.setStyle(this.element, 'top', '0px');
      this.renderer.setStyle(this.element, 'width', 'inherit');
      this.renderer.addClass(this.element, StacheAffixTopDirective.AFFIX_CLASS_NAME);
    }
  }

  private resetElement(): void {
    if (this.isAffixed) {
      this.isAffixed = false;
      this.renderer.setStyle(this.element, 'position', 'static');
      this.renderer.removeClass(this.element, StacheAffixTopDirective.AFFIX_CLASS_NAME);
    }
  }

  private setMaxHeight() {
    let maxHeight = `calc(100% - ${this.omnibarHeight}px)`;

    if (this.footerIsVisible()) {
      maxHeight = `${this.getOffset(this.footerWrapper) - this.windowRef.nativeWindow.pageYOffset - this.omnibarHeight}px`;
    }

    /* istanbul ignore else */
    if (this.element) {
      this.renderer.setStyle(this.element, 'height', `${maxHeight}`);
    }
  }

  private footerIsVisible(): boolean {
    if (this.footerWrapper) {
      return (this.footerWrapper.getBoundingClientRect().top <= (this.windowRef.nativeWindow.innerHeight));
    }

    return false;
  }
}
