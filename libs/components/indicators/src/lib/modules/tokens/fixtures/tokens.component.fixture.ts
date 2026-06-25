import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';

import { SkyTokensComponent } from '../tokens.component';
import { SkyToken } from '../types/token';
import { SkyTokenSelectedEventArgs } from '../types/token-selected-event-args';
import { SkyTokensMessage } from '../types/tokens-message';

@Component({
  selector: 'sky-tokens-test',
  templateUrl: './tokens.component.fixture.html',
  standalone: false,
})
export class SkyTokensTestComponent implements OnDestroy {
  @ViewChild(SkyTokensComponent, { read: ElementRef })
  public tokensElementRef: ElementRef | undefined;

  @ViewChild(SkyTokensComponent)
  public tokensComponent: SkyTokensComponent | undefined;

  public ariaLabel: string | undefined;
  public disabled: boolean | undefined;
  public dismissible: boolean | undefined;
  public displayWith: string | undefined;
  public focusable: boolean | undefined;
  public messageStream: Subject<SkyTokensMessage> | undefined;
  public tokens: SkyToken[] | undefined;
  public trackWith: string | undefined;

  public includeSingleToken = false;

  public innerContent: 'text' | 'form-control' = 'text';

  public data: { name: string; id?: number }[] = [
    { name: 'Red' },
    { name: 'White' },
    { name: 'Blue' },
  ];

  public ngOnDestroy(): void {
    if (this.messageStream) {
      this.messageStream.complete();
    }
  }

  public onFocusIndexOverRange(): void {}

  public onFocusIndexUnderRange(): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onTokensChange(args: SkyToken[]): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onTokenSelected(args: SkyTokenSelectedEventArgs): void {
    return;
  }

  public onTokensRendered(): void {
    return;
  }

  public publishTokens(): void {
    this.tokens = this.data.map((value) => ({ value }));
  }

  public publishMessageStream(): void {
    if (this.messageStream) {
      this.messageStream.unsubscribe();
    }

    this.messageStream = new Subject<SkyTokensMessage>();
  }
}
