import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tile1',
  templateUrl: './tile1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tile1Component {
  public tileSettingsClick() {
    alert('Tile settings clicked!');
  }
}
