import {
  Component,
  Input,
  Renderer2,
  OnDestroy,
  AfterViewInit
} from '@angular/core';

import {
  Subscription
} from 'rxjs';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  StacheNavLink
} from '../nav/nav-link';

import {
  StacheWindowRef
} from '../shared/window-ref';

const SIDEBAR_CSS_CLASS_NAME = 'stache-sidebar-enabled';
let nextUniqueId = 0;

@Component({
  selector: 'stache-sidebar-wrapper',
  templateUrl: './sidebar-wrapper.component.html',
  styleUrls: ['./sidebar-wrapper.component.scss']
})
export class StacheSidebarWrapperComponent implements  OnDestroy, AfterViewInit {
  @Input()
  public sidebarRoutes: StacheNavLink[];

  public sidebarOpen = false;

  public sidebarLabel = 'Click to open sidebar';

  public elementId = `stache-sidebar-content-panel-${nextUniqueId++}`;

  private mediaQuerySubscription: Subscription;

  constructor(
    private renderer: Renderer2,
    private windowRef: StacheWindowRef,
    private mediaQueryService: SkyMediaQueryService
  ) {

    this.mediaQuerySubscription = this.mediaQueryService
      .subscribe((args: SkyMediaBreakpoints) => {
        this.sidebarOpen = (args <= SkyMediaBreakpoints.sm);
        this.toggleSidebar();
      });
  }

  public ngAfterViewInit(): void {
    this.addClassToBody();
  }

  public ngOnDestroy(): void {
    this.removeClassFromBody();
    this.mediaQuerySubscription.unsubscribe();
  }

  public toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  private addClassToBody(): void {
    this.renderer.addClass(
      this.windowRef.nativeWindow.document.body,
      SIDEBAR_CSS_CLASS_NAME
    );
  }

  private removeClassFromBody(): void {
    this.renderer.removeClass(
      this.windowRef.nativeWindow.document.body,
      SIDEBAR_CSS_CLASS_NAME
    );
  }
}
