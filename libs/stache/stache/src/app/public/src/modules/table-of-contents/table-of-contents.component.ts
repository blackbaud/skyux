import {
  Component,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  HostListener
} from '@angular/core';
import {
  StacheNav,
  StacheNavLink
} from '../nav';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { StacheWindowRef } from '../shared';

@Component({
  selector: 'stache-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StacheTableOfContentsComponent implements StacheNav, AfterViewInit {
  @Input()
  public routes: StacheNavLink[] = [];

  private headerHeight: any;
  private documentElement: any;
  private documentBottom: number;
  private pageOffset: number;
  private window: Window;
  private activeRoute: StacheNavLink;

  constructor(
    private cdr: ChangeDetectorRef,
    private windowRef: StacheWindowRef
  ) {
    this.window = this.windowRef.nativeWindow;
    this.documentElement = this.window.document.documentElement;
  }

  public ngAfterViewInit() {
    this.cdr.markForCheck();
    this.getContentOffset();
  }

  @HostListener('window:scroll')
  public onScroll() {
    this.trackPageOffset();
    this.updateView();
  }

  private trackPageOffset() {
    // Represents top of page
    // headerHeight buffer removes discrepency when hero or other 'header' elements exist
    // 50px buffer aids in click-to-anchor and user visualization
    this.pageOffset = ((this.window.pageYOffset - this.headerHeight) + 50);

    // Tracks page bottom so final route can be highlighted if associated anchor provides limited content
    // (Logic based on Angular implementation)
    this.documentBottom = Math.round(this.documentElement.getBoundingClientRect().bottom);
  }

    // Updates ng-class level trigger to show/hide blue border marking location on page
    private updateView() {
      this.routes.forEach((route: StacheNavLink, index: number) => {
        if (this.isActiveRoute(route, index)) {
          route.isCurrent = true;
          this.activeRoute = route;
        } else {
          route.isCurrent = false;
        }
      });
    }

    private isActiveRoute(route: StacheNavLink, index: number): boolean {
      if ((this.window.innerHeight + 5) >= this.documentBottom) {
        this.activeRoute = this.routes[this.routes.length - 1];
        return route === this.activeRoute;
      }

      return route.offsetTop <= this.pageOffset
        && (this.routes[index + 1] === undefined || this.routes[index + 1].offsetTop > this.pageOffset);
    }

  // Checks to see if stache-wrapper exists and provides offset from top of window
  private getContentOffset() {
    const stacheWrapper = this.documentElement.querySelector('.stache-wrapper');

    if (stacheWrapper) {
      this.headerHeight = stacheWrapper.offsetTop;
    }
  }
}
