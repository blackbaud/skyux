import { Component, ElementRef, ViewChild, model } from '@angular/core';

import { SkyTokensComponent } from '../tokens.component';
import { SkyToken } from '../types/token';

@Component({
  selector: 'sky-tokens-projected-token-test',
  templateUrl: './tokens-projected-token.component.fixture.html',
  standalone: false,
})
export class SkyTokensProjectedTokenTestComponent {
  @ViewChild(SkyTokensComponent, { read: ElementRef })
  public tokensElementRef: ElementRef | undefined;

  @ViewChild(SkyTokensComponent)
  public tokensComponent: SkyTokensComponent | undefined;

  public tokens = model<SkyToken[] | undefined>(undefined);

  public includeAdditionalToken = model<boolean>(false);
}
