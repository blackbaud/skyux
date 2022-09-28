import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { TileParameters } from '../tile-parameters.token';
import { TileParametersType } from '../tile-parameters.type';

@Component({
  selector: 'app-tile1',
  templateUrl: './tile1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tile1Component {
  constructor(
    @Inject(TileParameters) public tileParameters: TileParametersType
  ) {}

  public tileSettingsClick() {
    console.log('Tile settings clicked!');
  }
}
