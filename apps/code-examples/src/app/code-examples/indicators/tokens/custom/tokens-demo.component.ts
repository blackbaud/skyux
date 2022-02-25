import { Component, OnDestroy } from '@angular/core';

import {
  SkyToken,
  SkyTokenSelectedEventArgs,
  SkyTokensMessage,
  SkyTokensMessageType,
} from '@skyux/indicators';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-tokens-demo',
  templateUrl: './tokens-demo.component.html',
})
export class TokensDemoComponent implements OnDestroy {
  public myTokens: SkyToken[];

  private defaultTokens = [
    { label: 'Canada' },
    { label: 'Older than 55' },
    { label: 'Employed' },
    { label: 'Added before 2018' },
  ];

  public tokensController: Subject<SkyTokensMessage>;

  constructor() {
    this.myTokens = this.getTokens(this.defaultTokens);
  }

  public ngOnDestroy(): void {
    if (this.tokensController) {
      this.tokensController.complete();
    }
  }

  public resetTokens(): void {
    this.createTokens();
  }

  public changeTokens(): void {
    this.myTokens = this.getTokens([
      { label: 'Paid' },
      { label: 'Pending' },
      { label: 'Past due' },
    ]);
  }

  public destroyTokens(): void {
    this.myTokens = undefined;
  }

  public createTokens(): void {
    this.myTokens = this.getTokens(this.defaultTokens);
  }

  public onTokenSelected(args: SkyTokenSelectedEventArgs): void {
    console.log('Token selected:', args);
  }

  public onFocusIndexUnderRange(): void {
    console.log('Focus index was less than zero.');
  }

  public onFocusIndexOverRange(): void {
    console.log('Focus index was greater than the number of tokens.');
  }

  public focusLastToken(): void {
    if (!this.tokensController) {
      this.tokensController = new Subject<SkyTokensMessage>();
    }

    this.tokensController.next({
      type: SkyTokensMessageType.FocusLastToken,
    });
  }

  private getTokens(data: any[]): SkyToken[] {
    return data.map((item: any) => {
      return {
        value: item,
      } as SkyToken;
    });
  }
}
