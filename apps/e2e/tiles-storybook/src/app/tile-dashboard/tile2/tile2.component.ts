import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TileParameters } from '../tile-parameters.token';
import { TileParametersType } from '../tile-parameters.type';

@Component({
  selector: 'app-tile2',
  templateUrl: './tile2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class Tile2Component {
  public tileParameters = inject<TileParametersType>(TileParameters);
}
