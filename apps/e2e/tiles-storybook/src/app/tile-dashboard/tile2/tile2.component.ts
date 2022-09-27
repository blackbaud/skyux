import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { TileParameters } from '../tile-parameters.token';
import { TileParametersType } from '../tile-parameters.type';

@Component({
  selector: 'app-tile2',
  templateUrl: './tile2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tile2Component {
  constructor(
    @Inject(TileParameters) public tileParameters: TileParametersType
  ) {}
}
