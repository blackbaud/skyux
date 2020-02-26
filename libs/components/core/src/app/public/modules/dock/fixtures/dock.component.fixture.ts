import {
  Component
} from '@angular/core';

import {
  SkyDockItem
} from '../dock-item';

import {
  SkyDockInsertComponentConfig
} from '../dock-insert-component-config';

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

  public set itemConfigs(value: SkyDockInsertComponentConfig[]) {
    value.forEach(c => this.addItem(c));
  }

  public dockItems: SkyDockItem<DockItemFixtureComponent>[] = [];

  constructor(
    public dockService: SkyDockService
  ) { }

  public addItem(config: SkyDockInsertComponentConfig): void {
    this.dockItems.push(this.dockService.insertComponent(DockItemFixtureComponent, config));
  }

  public removeAllItems(): void {
    this.dockItems.forEach(i => i.destroy());
  }

}
