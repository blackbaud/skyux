import { Component, Input, OnInit } from '@angular/core';

import { StacheNav, StacheNavLink, StacheNavService } from '../nav';

@Component({
  selector: 'stache-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class StacheSidebarComponent implements StacheNav, OnInit {
  @Input()
  public routes: StacheNavLink[];
  public heading: string;
  public headingRoute: string | string[];

  public constructor(
    private navService: StacheNavService) { }

  public ngOnInit(): void {
    if (!this.routes) {
      const activeRoutes = this.navService.getActiveRoutes();
      this.routes = this.filterRoutes(activeRoutes);
    }
  }

  public isHeadingActive(): boolean {
    const url = this.navService.getActiveUrl();
    return (url === this.headingRoute);
  }

  private filterRoutes(activeRoutes: StacheNavLink[]): StacheNavLink[] {
    const root = activeRoutes[0];

    this.heading = root.name;
    this.headingRoute = `/${root.path}`;

    return root.children;
  }
}
