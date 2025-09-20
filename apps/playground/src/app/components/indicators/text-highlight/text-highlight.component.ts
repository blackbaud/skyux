import { Component } from '@angular/core';

/**
 * @title Text highlight with basic setup
 */
@Component({
  selector: 'app-indicators-text-highlight-basic-example',
  templateUrl: './text-highlight.component.html',
  standalone: false,
})
export class TextHighlightComponent {
  protected searchTerm = '';
  protected showAdditionalContent = false;
}
