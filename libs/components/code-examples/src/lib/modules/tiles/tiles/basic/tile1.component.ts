import { Component } from '@angular/core';
import { SkyTilesModule } from '@skyux/tiles';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div.tile1',
  templateUrl: './tile1.component.html',
  imports: [SkyTilesModule],
})
export class Tile1Component {
  public tileSettingsClick(): void {
    alert('tile settings clicked');
  }
}
