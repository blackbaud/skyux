import { Component, OnDestroy } from '@angular/core';
import {
  SkyToken,
  SkyTokenSelectedEventArgs,
  SkyTokensMessage,
  SkyTokensMessageType,
} from '@skyux/indicators';

import { Subject } from 'rxjs';

import { TokensDemoItem } from './tokens-demo-item';

@Component({
  selector: 'app-tokens-demo',
  templateUrl: './tokens-demo.component.html',
})
export class TokensDemoComponent implements OnDestroy {
  public myTokens: SkyToken<TokensDemoItem>[];
  public tokensController = new Subject<SkyTokensMessage>();
  public selectedToken = '';

  #defaultItems: TokensDemoItem[] = [
    { label: 'Canada' },
    { label: 'Older than 55' },
    { label: 'Employed' },
    { label: 'Added before 2018' },
  ];

  constructor() {
    this.myTokens = this.#getTokens(this.#defaultItems);
  }

  public ngOnDestroy(): void {
    this.tokensController.complete();
  }

  public resetTokens(): void {
    this.createTokens();
  }

  public changeTokens(): void {
    this.myTokens = this.#getTokens([
      { label: 'Paid' },
      { label: 'Pending' },
      { label: 'Past due' },
    ]);
  }

  public destroyTokens(): void {
    this.myTokens = undefined;
  }

  public createTokens(): void {
    this.myTokens = this.#getTokens(this.#defaultItems);
  }

  public onTokenSelected(
    args: SkyTokenSelectedEventArgs<TokensDemoItem>
  ): void {
    this.selectedToken = args.token.value.label;
  }

  public onFocusIndexUnderRange(): void {
    console.log('Focus index was less than zero.');
  }

  public onFocusIndexOverRange(): void {
    console.log('Focus index was greater than the number of tokens.');
  }

  public focusLastToken(): void {
    this.tokensController.next({
      type: SkyTokensMessageType.FocusLastToken,
    });
  }

  #getTokens(data: TokensDemoItem[]): SkyToken<TokensDemoItem>[] {
    return data.map((item) => {
      return {
        value: item,
      };
    });
  }
}
