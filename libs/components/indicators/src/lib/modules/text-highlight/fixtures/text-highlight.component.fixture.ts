import { Component } from '@angular/core';

@Component({
  selector: 'sky-text-highlight-component',
  templateUrl: './text-highlight.component.fixture.html',
  standalone: false,
})
export class SkyTextHighlightTestComponent {
  public searchTerm: string | string[] | undefined;
  public showAdditionalContent = false;
  public innerText1 = 'Here is some test text.';
  public innerText2 =
    'Here is additional text that was previously hidden in src\\app.';
  public childElementsTest = false;
}
