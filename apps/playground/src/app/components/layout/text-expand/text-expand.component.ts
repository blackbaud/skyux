import { Component } from '@angular/core';

@Component({
  selector: 'app-text-expand',
  templateUrl: './text-expand.component.html',
  standalone: false,
})
export class TextExpandComponent {
  public shortText = 'This is a short text that does not need truncation.';

  public longText =
    'The text expand component truncates long blocks of text with an ellipsis and a "See more" link. When users select the link, the component expands to display the full text. If the text exceeds the maximum expanded length, the component expands in a modal instead of inline. This provides a way to display large amounts of text in a compact space while still giving users access to the full content when they need it.';

  public longTextWithNewlines =
    'The text expand component truncates long blocks of text.\n\nIt includes a link to expand the text.\n\nWhen the text exceeds the maximum expanded length, it opens in a modal.\n\nThis line ensures the newline count exceeds the default limit.';
}
