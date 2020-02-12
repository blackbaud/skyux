import {
  Component
} from '@angular/core';

import {
  SkyDockItem
} from '../dock-item';

import {
  SkyDockItemConfig
} from '../dock-item-config';

import {
  SkyDockService
} from '../dock.service';

import {
  DockItemFixtureComponent
} from './dock-item.component.fixture';

@Component({
  selector: 'dock-test',
  template: ''
})
export class DockFixtureComponent {

  public set itemConfigs(value: SkyDockItemConfig[]) {
    value.forEach(c => this.addItem(c));
  }

  public dockItems: SkyDockItem<DockItemFixtureComponent>[] = [];

  constructor(
    public dockService: SkyDockService
  ) { }

  public addItem(config: SkyDockItemConfig): void {
    this.dockItems.push(this.dockService.insertComponent(DockItemFixtureComponent, config));
  }

  public removeAllItems(): void {
    this.dockItems.forEach(i => i.destroy());
  }

}
