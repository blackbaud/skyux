import { Component } from '@angular/core';

@Component({
  selector: 'app-text-highlight-demo',
  templateUrl: './text-highlight-demo.component.html',
})
export class TextHighlightDemoComponent {
  public searchTerm: string;

  public showAdditionalContent = false;
}
