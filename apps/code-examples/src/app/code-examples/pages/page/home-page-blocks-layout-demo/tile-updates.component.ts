import { Component } from '@angular/core';
import { SkyTilesModule } from '@skyux/tiles';

@Component({
  standalone: true,
  selector: 'app-tile-updates',
  styles: `
    :host {
      display: block;
    }
  `,
  templateUrl: './tile-updates.component.html',
  imports: [SkyTilesModule],
})
export class TileUpdatesComponent {}
