import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange
} from '@skyux/docs-tools';

import {
  SkyToken
} from '../../public/public_api';

@Component({
  selector: 'app-tokens-docs',
  templateUrl: './tokens-docs.component.html'
})
export class TokensDocsComponent {

  public colors: SkyToken[];

  private defaultColors = [
    { name: 'Red' },
    { name: 'Black' },
    { name: 'Blue' },
    { name: 'Brown' },
    { name: 'Green' },
    { name: 'Orange' },
    { name: 'Pink' },
    { name: 'Purple' },
    { name: 'Turquoise' },
    { name: 'White' },
    { name: 'Yellow' }
  ];

  public demoSettings: any = {};

  constructor() {
    this.colors = this.getTokens(this.defaultColors);
  }

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.disabled !== undefined) {
      this.demoSettings.disabled = change.disabled;
    }
    if (change.dismissible !== undefined) {
      this.demoSettings.dismissible = change.dismissible;
    }
    if (change.focusable !== undefined) {
      this.demoSettings.focusable = change.focusable;
    }
  }

  public onDemoReset(): void {
    this.colors = this.getTokens(this.defaultColors);
  }

  private getTokens(data: any[]): SkyToken[] {
    return data.map((item: any) => {
      return {
        value: item
      } as SkyToken;
    });
  }

}
