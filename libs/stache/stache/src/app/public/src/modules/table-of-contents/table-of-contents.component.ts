import {
  Component,
  Input,
  OnDestroy } from '@angular/core';
import { StacheNavLink } from '../nav';
import { StacheOmnibarAdapterService, StacheWindowRef } from '../shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'stache-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss']
})
export class StacheTableOfContentsComponent implements OnDestroy {
  @Input()
  public routes: StacheNavLink[];
  private viewTop: number;
  private documentBottom: number;
  private scrollEventStream: Subscription;

  constructor(
    private windowRef: StacheWindowRef,
    private omnibarService: StacheOmnibarAdapterService
  ) {
    this.scrollEventStream = this.windowRef.scrollEventStream.subscribe(() => {
      this.updateRoutesOnScroll(this.routes);
    });
  }

  public ngOnDestroy() {
    this.scrollEventStream.unsubscribe();
  }

  public updateRoutesOnScroll(routes: any[]) {
    if (routes && routes.length) {
      this.updateView(routes);
    }
  }

  public updateView(routes: StacheNavLink[]) {
    this.trackViewTop();
    this.isCurrent(routes);
  }

  private trackViewTop() {
    this.viewTop = (this.windowRef.nativeWindow.pageYOffset + this.omnibarService.getHeight());
    this.documentBottom = Math.round(this.windowRef.nativeWindow.document.documentElement.getBoundingClientRect().bottom);
  }

  private isCurrent(routes: StacheNavLink[]): void {
    if (this.scrolledToEndOfPage()) {
      routes.forEach((route: StacheNavLink, idx: number) => {
        route.isCurrent = (idx === (routes.length - 1));
      });
      return;
    }
    routes.forEach((route, index) => {
      const nextRoute = routes[index + 1];
      if (nextRoute && nextRoute.offsetTop <= this.viewTop) {
        route.isCurrent = false;
        return;
      }
      route.isCurrent = route.offsetTop <= this.viewTop;
    });
  }

  private scrolledToEndOfPage() {
    return (this.windowRef.nativeWindow.innerHeight + 5) >= this.documentBottom;
  }
}
