import { Component } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div.tile1',
  templateUrl: './tile-demo-tile1.component.html',
})
export class TileDemoTile1Component {
  public tileSettingsClick(): void {
    alert('tile settings clicked');
  }

  public onActionClick(): void {
    alert('Help inline button clicked!');
  }

  public onHelpClick($event: MouseEvent): void {
    $event.stopPropagation();
  }
}
