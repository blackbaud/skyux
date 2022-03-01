import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';

import { SkyTokensComponent } from '../tokens.component';
import { SkyToken } from '../types/token';
import { SkyTokenSelectedEventArgs } from '../types/token-selected-event-args';
import { SkyTokensMessage } from '../types/tokens-message';

@Component({
  selector: 'sky-tokens-test',
  templateUrl: './tokens.component.fixture.html',
})
export class SkyTokensTestComponent implements OnDestroy {
  @ViewChild(SkyTokensComponent, { read: ElementRef })
  public tokensElementRef: ElementRef;

  @ViewChild(SkyTokensComponent)
  public tokensComponent: SkyTokensComponent;

  public ariaLabel: string;
  public disabled: boolean;
  public dismissible: boolean;
  public displayWith: string;
  public focusable: boolean;
  public messageStream: Subject<SkyTokensMessage>;
  public tokens: SkyToken[];
  public trackWith: string;

  public includeSingleToken = false;

  public data: any[] = [{ name: 'Red' }, { name: 'White' }, { name: 'Blue' }];

  public ngOnDestroy(): void {
    if (this.messageStream) {
      this.messageStream.complete();
    }
  }

  public onFocusIndexOverRange(): void {}

  public onFocusIndexUnderRange(): void {}

  public onTokenSelected(args: SkyTokenSelectedEventArgs): void {}

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
