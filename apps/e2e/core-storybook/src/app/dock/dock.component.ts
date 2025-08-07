import { AfterViewInit, Component } from '@angular/core';
import { SkyDockService } from '@skyux/core';

import { DockItemVisualContext } from './dock-item-context';
import { DockItemVisualComponent } from './dock-item-visual.component';

@Component({
  selector: 'app-dock',
  templateUrl: './dock.component.html',
  styleUrls: ['./dock.component.scss'],
  standalone: false,
})
export class DockComponent implements AfterViewInit {
  public stackOrder = 0;

  /* spell-checker:disable */
  #configs: DockItemVisualContext[] = [
    {
      stackOrder: 0,
      backgroundColor: 'darkred',
    },
    {
      stackOrder: 100,
      backgroundColor: 'darkmagenta',
    },
    {
      stackOrder: 10,
      backgroundColor: 'darkcyan',
    },
    {
      stackOrder: -1000,
      backgroundColor: 'darkblue',
    },
    {
      stackOrder: 1,
      backgroundColor: 'darkgreen',
    },
  ];
  /* spell-checker:enable */

  #dockService: SkyDockService;

  constructor(dockService: SkyDockService) {
    this.#dockService = dockService;
  }

  public ngAfterViewInit(): void {
    this.#configs.forEach((config) => {
      this.#addToDock(config);
    });
  }

  public onAddItemClick(): void {
    this.#addToDock({
      backgroundColor: 'tan',
      stackOrder: this.stackOrder,
    });
  }

  #addToDock(config: DockItemVisualContext): void {
    const item = this.#dockService.insertComponent(DockItemVisualComponent, {
      stackOrder: config.stackOrder,
      providers: [
        {
          provide: DockItemVisualContext,
          useValue: new DockItemVisualContext(
            config.backgroundColor,
            config.stackOrder,
          ),
        },
      ],
    });

    item.componentInstance.stackOrderForDisplay = item.stackOrder;

    item.destroyed.subscribe(() => {
      console.log('Dock item destroyed:', item.stackOrder);
    });

    item.componentInstance.closeClicked.subscribe(() => item.destroy());
  }
}
