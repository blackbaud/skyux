import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Renderer2
} from '@angular/core';

import { StacheWindowRef } from '../shared';

@Directive({
  selector: '[stacheAffixTop]'
})
export class StacheAffixTopDirective implements AfterViewInit {
  public static readonly AFFIX_CLASS_NAME: string = 'stache-affix-top';
  public isAffixed = false;

  private offsetTop: number = 0;
  private element: any;

  constructor (
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private windowRef: StacheWindowRef) { }

  public ngAfterViewInit(): void {
    const nativeElement = this.elementRef.nativeElement;

    if (this.isComponent(nativeElement) && nativeElement.children[0]) {
      this.element = nativeElement.children[0];
    } else {
      this.element = nativeElement;
    }
  }

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    if (!this.isAffixed) {
      this.offsetTop = this.element.offsetTop;
    }

    const windowIsScrolledBeyondElement =
      (this.offsetTop <= this.windowRef.nativeWindow.scrollY);

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

  private affixToTop(): void {
    if (!this.isAffixed) {
      this.isAffixed = true;
      this.renderer.setStyle(this.element, 'position', 'fixed');
      this.renderer.setStyle(this.element, 'top', '0px');
      this.renderer.addClass(this.element, StacheAffixTopDirective.AFFIX_CLASS_NAME);
    }
  }

  private resetElement(): void {
    if (this.isAffixed) {
      this.isAffixed = false;
      this.renderer.setStyle(this.element, 'position', 'initial');
      this.renderer.setStyle(this.element, 'top', `${this.offsetTop}px`);
      this.renderer.removeClass(this.element, StacheAffixTopDirective.AFFIX_CLASS_NAME);
    }
  }
}
