import { LocationStrategy } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';

import { StacheNavService } from '../nav/nav.service';
import { StacheRouteService } from '../router/route.service';

@Directive({
  selector: '[stacheRouterLink]',
})
export class StacheRouterLinkDirective implements OnChanges, AfterViewInit {
  private _stacheRouterLink = '';

  @Input()
  set stacheRouterLink(routerLink: string) {
    if (routerLink === '.') {
      this._stacheRouterLink = this.routerService.getActiveUrl();
    } else {
      this._stacheRouterLink = routerLink;
    }
  }

  get stacheRouterLink() {
    return this._stacheRouterLink;
  }

  @Input()
  public fragment: string;

  // the url displayed on the anchor element.
  @HostBinding()
  public href: string;

  constructor(
    private navService: StacheNavService,
    private routerService: StacheRouteService,
    private el: ElementRef,
    private locationStrategy: LocationStrategy,
    private renderer: Renderer2
  ) {
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
  }

  public ngOnChanges(): any {
    this.updateTargetUrlAndHref();
  }

  public ngAfterViewInit() {
    this.updateTargetUrlAndHref();
  }

  @HostListener('click', ['$event'])
  public navigate(event: MouseEvent): boolean {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return true;
    } else {
      event.preventDefault();
      this.navService.navigate({
        path: this.stacheRouterLink,
        fragment: this.fragment,
      });
      return true;
    }
  }

  private updateTargetUrlAndHref(): void {
    let path = `${this.stacheRouterLink}`;

    if (this.fragment) {
      path += `#${this.fragment}`;
    }

    if (this.navService.isExternal(path)) {
      this.href = path;
    } else {
      this.href = this.locationStrategy.prepareExternalUrl(path);
    }
  }
}
