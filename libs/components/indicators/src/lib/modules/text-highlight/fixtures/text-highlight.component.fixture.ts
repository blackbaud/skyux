import { Component, model } from '@angular/core';

@Component({
  selector: 'sky-text-highlight-component',
  templateUrl: './text-highlight.component.fixture.html',
  standalone: false,
})
export class SkyTextHighlightTestComponent {
  public searchTerm = model<string | string[] | undefined>(undefined);
  public showAdditionalContent = model<boolean>(false);
  public innerText1 = model<string>('Here is some test text.');
  public innerText2 = model<string>(
    'Here is additional text that was previously hidden in src\\app.',
  );
  public childElementsTest = model<boolean>(false);
}
