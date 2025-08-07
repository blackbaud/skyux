import { Component } from '@angular/core';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyTilesModule } from '@skyux/tiles';

@Component({
  selector: 'app-tile-my-actions',
  styles: `
    :host {
      display: block;
    }
  `,
  templateUrl: './tile-my-actions.component.html',
  imports: [SkyTilesModule, SkyDropdownModule, SkyRepeaterModule],
})
export class TileMyActionsComponent {
  protected items: {
    date: string;
    status?: string;
    title?: string;
    accessibilityLabel?: string;
  }[] = [
    {
      title: 'Send invitation to Spring Ball',
      date: 'Today',
    },
    {
      title: 'Review portal activity',
      date: '10/2/2024',
    },
    {
      title: 'Assign prospects',
      date: '10/3/2024',
    },
  ];
  protected onActionClicked(buttonText: string): void {
    alert(buttonText + ' was clicked!');
  }
}
