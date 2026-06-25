import { Component, inject } from '@angular/core';

import { SkyDockInsertComponentConfig } from '../dock-insert-component-config';
import { SkyDockItem } from '../dock-item';
import { SkyDockOptions } from '../dock-options';
import { SkyDockService } from '../dock.service';

import { DockItemFixtureComponent } from './dock-item.component.fixture';

@Component({
  selector: 'sky-dock-test',
  template: '<div id="innerDiv"></div>',
  standalone: false,
})
export class DockFixtureComponent {
  public set itemConfigs(value: (SkyDockInsertComponentConfig | undefined)[]) {
    value.forEach((c) => this.addItem(c));
  }

  public readonly dockService = inject(SkyDockService);
  public dockItems: SkyDockItem<DockItemFixtureComponent>[] = [];

  public addItem(config: SkyDockInsertComponentConfig | undefined): void {
    this.dockItems.push(
      this.dockService.insertComponent(DockItemFixtureComponent, config),
    );
  }

  public removeAllItems(): void {
    this.dockItems.forEach((i) => i.destroy());
  }

  public setOptions(options: SkyDockOptions): void {
    this.dockService.setDockOptions(options);
  }
}
