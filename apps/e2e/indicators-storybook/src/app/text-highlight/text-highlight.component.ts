import { Component } from '@angular/core';

@Component({
  selector: 'app-text-highlight',
  templateUrl: './text-highlight.component.html',
  styleUrls: ['./text-highlight.component.scss'],
  standalone: false,
})
export class TextHighlightComponent {
  public highlightSentence = " Doesn't it look great.";
}
