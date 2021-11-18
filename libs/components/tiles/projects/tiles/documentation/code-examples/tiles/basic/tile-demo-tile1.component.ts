import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line
  selector: 'div.tile1',
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
