import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TileParameters } from '../tile-parameters.token';
import { TileParametersType } from '../tile-parameters.type';

@Component({
  selector: 'app-tile1',
  templateUrl: './tile1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class Tile1Component {
  public tileParameters = inject<TileParametersType>(TileParameters);

  public tileSettingsClick(): void {
    console.log('Tile settings clicked!');
  }
}
