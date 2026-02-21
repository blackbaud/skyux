import {
  Component,
  EnvironmentInjector,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

let columnIdIndex = 0;

/**
 * @internal
 */
@Component({
  selector: 'sky-tile-dashboard-column',
  styleUrls: ['./tile-dashboard-column.component.scss'],
  templateUrl: './tile-dashboard-column.component.html',
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkyTileDashboardColumnComponent {
  public columnId: string;

  @ViewChild('content', {
    read: ViewContainerRef,
    static: false,
  })
  public content: ViewContainerRef | undefined;

  constructor(public injector: EnvironmentInjector) {
    this.columnId = `tile-dashboard-column-${++columnIdIndex}`;
  }
}
