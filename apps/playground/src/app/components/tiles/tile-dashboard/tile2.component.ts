import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyTilesModule } from '@skyux/tiles';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div.tile2',
  templateUrl: './tile2.component.html',
  imports: [SkyHelpInlineModule, SkyTilesModule],
})
export class Tile2Component {
  protected onActionClick(): void {
    alert('Help inline button clicked!');
  }

  protected onHelpClick($event: MouseEvent): void {
    $event.stopPropagation();
  }

  protected settingsClick(): void {
    alert('Settings clicked!');
  }
}
