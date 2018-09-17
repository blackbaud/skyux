import { Component } from '@angular/core';

@Component({
    selector: 'sky-text-highlight-component',
    templateUrl: 'text-highlight.component.fixture.html'
})

export class SkyTextHighlightTestComponent {
  public searchTerm: string;
  public showAdditionalContent: boolean = false;
}
