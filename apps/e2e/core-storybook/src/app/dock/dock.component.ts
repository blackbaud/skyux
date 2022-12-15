import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { SkyDockItem, SkyDockService } from '@skyux/core';

import { DockedComponent } from './docked.component';

@Component({
  selector: 'app-dock',
  templateUrl: './dock.component.html',
  styleUrls: ['./dock.component.scss'],
})
export class DockComponent implements AfterViewInit, OnDestroy {
  #dockItem: SkyDockItem<DockedComponent> | undefined;
  #dockService: SkyDockService;

  constructor(dockService: SkyDockService) {
    this.#dockService = dockService;
  }

  ngAfterViewInit(): void {
    this.#dockItem = this.#dockService.insertComponent(DockedComponent);
  }

  ngOnDestroy(): void {
    if (this.#dockItem) {
      this.#dockItem.destroy();
      this.#dockItem = undefined;
    }
  }
}
