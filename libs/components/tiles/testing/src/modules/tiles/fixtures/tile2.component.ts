import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyTilesModule } from '@skyux/tiles';

@Component({
  selector: 'div.tile2',
  templateUrl: './tile2.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyTilesModule],
})
export class Tile2Component {}
