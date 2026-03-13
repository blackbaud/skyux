import { Component } from '@angular/core';
import { SkyTextExpandModule } from '@skyux/layout';

@Component({
  imports: [SkyTextExpandModule],
  selector: 'app-text-expand',
  templateUrl: './text-expand.component.html',
})
export class TextExpandComponent {
  protected shortText = 'This is a short text that does not need truncation.';

  protected longText =
    'The text expand component truncates long blocks of text with an ellipsis and a "See more" link. When users select the link, the component expands to display the full text. If the text exceeds the maximum expanded length, the component expands in a modal instead of inline. This provides a way to display large amounts of text in a compact space while still giving users access to the full content when they need it.';

  protected longTextWithNewlines =
    'The text expand component truncates long blocks of text.\n\nIt includes a link to expand the text.\n\nWhen the text exceeds the maximum expanded length, it opens in a modal.\n\nThis line ensures the newline count exceeds the default limit.';
}
