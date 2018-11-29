import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line
  selector: 'div.tile1',
  templateUrl: './tile-demo-tile1.component.html'
})
export class SkyTileDemoTile1Component {
  public tileHelpClick() {
    alert('tile help clicked');
  }

  public tileSettingsClick() {
    alert('tile settings clicked');
  }
}
