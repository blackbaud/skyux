import { Component } from '@angular/core';
import { SkyTilesModule } from '@skyux/tiles';

@Component({
  standalone: true,
  selector: 'div.tile2',
  templateUrl: './tile2.component.html',
  imports: [SkyTilesModule],
})
export class Tile2Component {}
