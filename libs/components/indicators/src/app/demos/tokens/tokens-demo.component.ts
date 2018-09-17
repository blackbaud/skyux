import {
  Component,
  OnDestroy
} from '@angular/core';

import { Subject } from 'rxjs/Subject';

import {
  SkyToken,
  SkyTokenSelectedEventArgs,
  SkyTokensMessageType,
  SkyTokensMessage
} from '../../public';

@Component({
  selector: 'sky-tokens-demo',
  templateUrl: './tokens-demo.component.html'
})
export class SkyTokensDemoComponent implements OnDestroy {
  public colors: SkyToken[];
  public filters: SkyToken[];
  public tokensController: Subject<SkyTokensMessage>;

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

  private selectedFilters = [
    { label: 'Canada' },
    { label: 'Older than 55' },
    { label: 'Employed' },
    { label: 'Added before 2018' }
  ];

  constructor() {
    this.createColors();
    this.filters = this.parseTokens(this.selectedFilters);
  }

  public ngOnDestroy() {
    if (this.tokensController) {
      this.tokensController.complete();
    }
  }

  public resetColors() {
    this.createColors();
  }

  public changeColors() {
    this.colors = this.parseTokens([
      { name: 'Red' },
      { name: 'White' },
      { name: 'Blue' }
    ]);
  }

  public destroyColors() {
    this.colors = undefined;
  }

  public createColors() {
    this.colors = this.parseTokens(this.defaultColors);
  }

  public onTokenSelected(args: SkyTokenSelectedEventArgs) {
    console.log('Token selected:', args);
  }

  public onFocusIndexUnderRange() {
    console.log('Focus index was less than zero.');
  }

  public onFocusIndexOverRange() {
    console.log('Focus index was greater than the number of tokens.');
  }

  public focusLastToken() {
    if (!this.tokensController) {
      this.tokensController = new Subject<SkyTokensMessage>();
    }

    this.tokensController.next({
      type: SkyTokensMessageType.FocusLastToken
    });
  }

  private parseTokens(data: any[]): SkyToken[] {
    return data.map((item: any) => {
      return {
        value: item
      } as SkyToken;
    });
  }
}
