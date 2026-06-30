import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyTilesModule } from '@skyux/tiles';

@Component({
  selector: 'app-tile-updates',
  styles: `
    :host {
      display: block;
    }
  `,
  templateUrl: './tile-updates.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyTilesModule],
})
export class TileUpdatesComponent {}
