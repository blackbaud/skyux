import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyTilesModule } from '@skyux/tiles';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyTilesModule],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div.tile2',
  template: `
    <sky-tile
      [showHelp]="true"
      [showSettings]="true"
      (helpClick)="onHelpClick()"
      (settingsClick)="settingsClick()"
    >
      <sky-tile-title> Tile 3 w/ legacy help click </sky-tile-title>
      <sky-tile-content>
        <sky-tile-content-section> Content here. </sky-tile-content-section>
      </sky-tile-content>
    </sky-tile>
  `,
})
export class Tile3Component {
  public onHelpClick(): void {
    console.log('help clicked');
  }

  protected settingsClick(): void {
    alert('Settings clicked!');
  }
}
