import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyTilesModule } from '@skyux/tiles';

@Component({
  standalone: true,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div.tile1',
  templateUrl: './tile1.component.html',
  imports: [SkyHelpInlineModule, SkyTilesModule],
})
export class Tile1Component {
  protected tileSettingsClick(): void {
    alert('tile settings clicked');
  }

  protected onActionClick(): void {
    alert('Help inline button clicked!');
  }

  protected onHelpClick($event: MouseEvent): void {
    $event.stopPropagation();
  }
}
