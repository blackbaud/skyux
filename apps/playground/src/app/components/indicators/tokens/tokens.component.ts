import { Component } from '@angular/core';
import {
  SkyToken,
  SkyTokensMessage,
  SkyTokensMessageType,
} from '@skyux/indicators';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  standalone: false,
})
export class TokensComponent {
  public colors: SkyToken[] = [
    { id: 1, name: 'Black' },
    { id: 2, name: 'Blue' },
    { id: 3, name: 'Brown' },
    { id: 4, name: 'Green' },
    { id: 5, name: 'Orange' },
    { id: 6, name: 'Pink' },
    { id: 7, name: 'Purple' },
    { id: 8, name: 'Red' },
    { id: 9, name: 'Turquoise' },
    { id: 10, name: 'White' },
    { id: 11, name: 'Yellow' },
  ].map((value) => ({ value }));

  public filters: SkyToken[] = [
    { id: 1, label: 'Canada' },
    { id: 2, label: 'Older than 55' },
    { id: 3, label: 'Employed' },
    { id: 4, label: 'Added before 2018' },
  ].map((value) => ({ value }));

  public tokensController = new Subject<SkyTokensMessage>();

  public tokensControllerDisabled = new Subject<SkyTokensMessage>();

  public focusLast(): void {
    this.tokensController.next({ type: SkyTokensMessageType.FocusLastToken });
  }

  public focusLastDisabled(): void {
    this.tokensControllerDisabled.next({
      type: SkyTokensMessageType.FocusLastToken,
    });
  }
}
