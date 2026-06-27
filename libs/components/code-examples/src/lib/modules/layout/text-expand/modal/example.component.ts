import { Component } from '@angular/core';
import { SkyTextExpandModule } from '@skyux/layout';

/**
 * @title Text expand with a modal
 */
@Component({
  selector: 'app-layout-text-expand-modal-example',
  templateUrl: './example.component.html',
  imports: [SkyTextExpandModule],
})
export class LayoutTextExpandModalExampleComponent {
  protected longText =
    'The text expand component truncates long blocks of text with an ellipsis and a link to expand the text. Users select the link to expand the full text inline unless it exceeds limits on text characters or newline characters. If the text exceeds those limits, then it expands in a modal view instead. The component does not truncate text that is shorter than a specified threshold, and by default, it removes newline characters from truncated text.';
}
