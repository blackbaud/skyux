import {
  Component
} from '@angular/core';

import {
  SkyDockService
} from '../../public';

import {
  DockItemVisualContext
} from './dock-item-context';

import {
  DockItemVisualComponent
} from './dock-item-visual.component';

@Component({
  selector: 'dock-visual',
  templateUrl: './dock-visual.component.html',
  styleUrls: ['./dock-visual.component.scss']
})
export class DockVisualComponent {

  public stackOrder: number;

  private configs: any[] = [
    {
      stackOrder: 0,
      backgroundColor: 'darkred'
    },
    {
      stackOrder: 100,
      backgroundColor: 'darkmagenta'
    },
    {
      stackOrder: 10,
      backgroundColor: 'darkcyan'
    },
    {
      stackOrder: -1000,
      backgroundColor: 'darkblue'
    },
    {
      stackOrder: 1,
      backgroundColor: 'darkgreen'
    }
  ];

  constructor(
    private dockService: SkyDockService
  ) {
    this.configs.forEach((config) => {
      this.addToDock(config);
    });
  }

  public onAddItemClick(): void {
    this.addToDock({
      backgroundColor: 'tan',
      stackOrder: this.stackOrder
    });
  }

  private addToDock(config: any): void {
    const item = this.dockService.insertComponent(DockItemVisualComponent, {
      stackOrder: config.stackOrder,
      providers: [
        {
          provide: DockItemVisualContext,
          useValue: new DockItemVisualContext(
            config.backgroundColor,
            config.stackOrder
          )
        }
      ]
    });

    item.componentInstance.stackOrderForDisplay = item.stackOrder;

    item.destroyed.subscribe(() => {
      console.log('Dock item destroyed:', item.stackOrder);
    });

    item.componentInstance.closeClicked.subscribe(() => item.destroy());
  }
}
