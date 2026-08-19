import { Component, ElementRef, ViewChild } from '@angular/core';

import { SkyTokensComponent } from '../tokens.component';

@Component({
  selector: 'sky-tokens-projected-token-test',
  templateUrl: './tokens-projected-token.component.fixture.html',
  standalone: false,
})
export class SkyTokensProjectedTokenTestComponent {
  @ViewChild(SkyTokensComponent, { read: ElementRef })
  public tokensElementRef: ElementRef | undefined;
}
