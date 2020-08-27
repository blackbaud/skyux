import {
  Component
} from '@angular/core';

import {
  SkyThemeService
} from '@skyux/theme';

@Component({
  // tslint:disable-next-line
  selector: 'div.tile1',
  templateUrl: './inline-form-demo-tile.component.html'
})
export class SkyTileDemoTileComponent {
  public activeItemId: string;
  public tileData = [
    { id: '1', title: 'Octopus\'s Garden', note: 'Written by Ringo Starr' },
    { id: '2', title: 'With a Little Help from My Friends', note: 'Written by Paul McCartney and John Lennon' },
    { id: '3', title: 'While my Guitar Gently Weeps', note: 'Written by George Harrison' }
  ];

  constructor(public themeSvc: SkyThemeService) { }

  public onInlineFormClose(event: any): void {
    this.activeItemId = undefined;
    console.log(event);
  }
}
