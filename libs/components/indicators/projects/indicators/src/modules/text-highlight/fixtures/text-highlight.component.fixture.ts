import { Component, ViewChild } from '@angular/core';

import { SkyTextHighlightDirective } from '../text-highlight.directive';

@Component({
  selector: 'sky-text-highlight-component',
  templateUrl: 'text-highlight.component.fixture.html',
})
export class SkyTextHighlightTestComponent {
  public searchTerm: string;
  public showAdditionalContent = false;
  public innerText1 = 'Here is some test text.';
  public innerText2 =
    'Here is additional text that was previously hidden in src\\app.';

  @ViewChild(SkyTextHighlightDirective)
  public textHighlightDirective: SkyTextHighlightDirective;
}
