import { Component, Input, Renderer2, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SkyMediaQueryService, SkyMediaBreakpoints } from '@blackbaud/skyux/dist/core';

import { StacheNavLink } from '../nav';
import { StacheWindowRef } from '../shared';

const HAS_SIDEBAR_CLASS_NAME: string  = 'stache-sidebar-enabled';
let nextUniqueId = 0;

@Component({
  selector: 'stache-sidebar-wrapper',
  templateUrl: './sidebar-wrapper.component.html',
  styleUrls: ['./sidebar-wrapper.component.scss']
})
export class StacheSidebarWrapperComponent implements  OnDestroy, AfterViewInit {
  @Input()
  public sidebarRoutes: StacheNavLink[];

  public sidebarOpen: boolean = false;

  public sidebarLabel: string = 'Click to open sidebar';

  public elementId = `stache-sidebar-content-panel-${(nextUniqueId++)}`;

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

  public toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  public ngOnDestroy(): void {
    this.removeClassFromBody();
    this.mediaQuerySubscription.unsubscribe();
  }

  private addClassToBody(): void {
    this.renderer.addClass(
      this.windowRef.nativeWindow.document.body,
      HAS_SIDEBAR_CLASS_NAME
    );
  }

  private removeClassFromBody(): void {
    this.renderer.removeClass(
      this.windowRef.nativeWindow.document.body,
      HAS_SIDEBAR_CLASS_NAME
    );
  }
}
