import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  createComponent,
  Injector,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { SkyTileDashboardService } from '../tile-dashboard/tile-dashboard.service';

let columnIdIndex = 0;

/**
 * @internal
 */
@Component({
  selector: 'sky-tile-dashboard-column',
  styleUrls: ['./tile-dashboard-column.component.scss'],
  templateUrl: './tile-dashboard-column.component.html',
})
export class SkyTileDashboardColumnComponent {
  public bagId: string;

  public columnId: string;

  @ViewChild('content', {
    read: ViewContainerRef,
    static: false,
  })
  public content: ViewContainerRef | undefined;

  #dashboardService: SkyTileDashboardService;

  constructor(
    public resolver: ComponentFactoryResolver,
    public injector: Injector,
    dashboardService: SkyTileDashboardService
  ) {
    this.#dashboardService = dashboardService;

    this.columnId = `tile-dashboard-column-${++columnIdIndex}`;

    this.bagId = this.#dashboardService.bagId;

    public createTileComponent<T>(componentType: T): ComponentRef<T> {
      return createComponent(componentType, { })

    }
  }
}
