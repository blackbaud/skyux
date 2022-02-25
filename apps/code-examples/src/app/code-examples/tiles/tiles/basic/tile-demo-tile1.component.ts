import { Component } from '@angular/core';

@Component({
  selector: 'app-tile-demo-tile1',
  templateUrl: './tile-demo-tile1.component.html',
})
export class TileDemoTile1Component {
  public tileHelpClick(): void {
    alert('tile help clicked');
  }

  public tileSettingsClick(): void {
    alert('tile settings clicked');
  }
}
