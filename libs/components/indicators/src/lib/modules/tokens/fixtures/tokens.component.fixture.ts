import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  model,
} from '@angular/core';

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

  public ariaLabel = model<string | undefined>(undefined);
  public disabled = model<boolean | undefined>(undefined);
  public dismissible = model<boolean | undefined>(undefined);
  public displayWith = model<string | undefined>(undefined);
  public focusable = model<boolean | undefined>(undefined);
  public messageStream = model<Subject<SkyTokensMessage> | undefined>(
    undefined,
  );
  public tokens = model<SkyToken[] | undefined>(undefined);
  public trackWith = model<string | undefined>(undefined);

  public includeSingleToken = model<boolean>(false);

  public innerContent = model<'text' | 'form-control'>('text');

  public data = model<{ name: string; id?: number }[]>([
    { name: 'Red' },
    { name: 'White' },
    { name: 'Blue' },
  ]);

  public ngOnDestroy(): void {
    const stream = this.messageStream();
    if (stream) {
      stream.complete();
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
    this.tokens.set(this.data().map((value) => ({ value })));
  }

  public publishMessageStream(): void {
    const existing = this.messageStream();
    if (existing) {
      existing.unsubscribe();
    }

    this.messageStream.set(new Subject<SkyTokensMessage>());
  }
}
