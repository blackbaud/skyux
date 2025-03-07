import { Component, OnDestroy } from '@angular/core';
import {
  SkyToken,
  SkyTokenSelectedEventArgs,
  SkyTokensMessage,
  SkyTokensMessageType,
  SkyTokensModule,
} from '@skyux/indicators';

import { Subject } from 'rxjs';

interface TokenItem {
  label: string;
}

/**
 * Tokens with programmatic interactions
 */
@Component({
  selector: 'app-indicators-tokens-custom-example',
  templateUrl: './example.component.html',
  imports: [SkyTokensModule],
})
export class IndicatorsTokensCustomExampleComponent implements OnDestroy {
  protected myTokens: SkyToken<TokenItem>[] | undefined;
  protected tokensController = new Subject<SkyTokensMessage>();
  protected selectedToken: string | undefined = '';

  #defaultItems: TokenItem[] = [
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

  protected resetTokens(): void {
    this.createTokens();
  }

  protected changeTokens(): void {
    this.myTokens = this.#getTokens([
      { label: 'Paid' },
      { label: 'Pending' },
      { label: 'Past due' },
    ]);
  }

  protected destroyTokens(): void {
    this.myTokens = undefined;
  }

  protected createTokens(): void {
    this.myTokens = this.#getTokens(this.#defaultItems);
  }

  protected onTokenSelected(args: SkyTokenSelectedEventArgs<TokenItem>): void {
    this.selectedToken = args.token?.value.label;
  }

  protected onFocusIndexUnderRange(): void {
    console.log('Focus index was less than zero.');
  }

  protected onFocusIndexOverRange(): void {
    console.log('Focus index was greater than the number of tokens.');
  }

  protected focusLastToken(): void {
    this.tokensController.next({
      type: SkyTokensMessageType.FocusLastToken,
    });
  }

  #getTokens(data: TokenItem[]): SkyToken<TokenItem>[] {
    return data.map((item) => {
      return {
        value: item,
      };
    });
  }
}
