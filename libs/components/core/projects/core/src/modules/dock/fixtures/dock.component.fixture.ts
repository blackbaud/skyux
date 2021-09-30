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

import {
  SkyDockOptions
} from '../dock-options';

@Component({
  selector: 'sky-dock-test',
  template: '<div id="innerDiv"></div>'
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

  public setOptions(options: SkyDockOptions): void {
    this.dockService.setDockOptions(options);
  }

}
