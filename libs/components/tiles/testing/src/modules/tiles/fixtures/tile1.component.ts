import { Component } from '@angular/core';
import { SkyTilesModule } from '@skyux/tiles';

@Component({
  standalone: true,
  selector: 'div.tile1',
  templateUrl: './tile1.component.html',
  imports: [SkyTilesModule],
})
export class Tile1Component {
  public helpKey: string | undefined;
  public helpContent: string | undefined;
  public helpTitle: string | undefined;
  public showSections = true;
  public showSettings = true;

  public tileSettingsClick(): void {
    alert('tile settings clicked');
  }
}
