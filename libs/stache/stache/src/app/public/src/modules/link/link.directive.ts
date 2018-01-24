import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

import { StacheNavService } from '../nav';

@Directive({
  selector: '[stacheRouterLink]'
})
export class StacheRouterLinkDirective {
  @Input()
  public stacheRouterLink: string;

  @Input()
  public fragment: string;

  constructor(
    private navService: StacheNavService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('click', ['$event'])
  public navigate(event: MouseEvent): void {
    event.preventDefault();
    this.navService.navigate({
      path: this.stacheRouterLink,
      fragment: this.fragment
    });
  }
}
