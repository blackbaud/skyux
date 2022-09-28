import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { TileParameters } from '../tile-parameters.token';
import { TileParametersType } from '../tile-parameters.type';

@Component({
  selector: 'app-tile1',
  templateUrl: './tile1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tile1Component {
  public tileParameters: TileParametersType;

  constructor(
    @Inject(TileParameters) tileParameters: TileParametersType | any
  ) {
    this.tileParameters = tileParameters as TileParametersType;
  }

  public tileSettingsClick() {
    console.log('Tile settings clicked!');
  }
}
