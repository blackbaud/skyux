import { Component, input } from '@angular/core';
import { SkyTilesModule } from '@skyux/tiles';

@Component({
  selector: 'div.tile1',
  templateUrl: './tile1.component.html',
  imports: [SkyTilesModule],
})
export class Tile1Component {
  public helpKey = input<string | undefined>(undefined);
  public helpContent = input<string | undefined>(undefined);
  public helpTitle = input<string | undefined>(undefined);
  public showSections = input(true);
  public showSettings = input(true);

  public tileSettingsClick(): void {
    alert('tile settings clicked');
  }
}
