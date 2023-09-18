import { Component } from '@angular/core';
import { SkyTextExpandModule } from '@skyux/layout';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyTextExpandModule],
})
export class DemoComponent {
  protected newlinesText =
    'The text expand component truncates long blocks of text with an ellipsis and a link to expand the text.\nUsers select the link to expand the full text inline unless it exceeds limits on text characters or newline characters.\nIf the text exceeds those limits, then it expands in a modal view instead.\nThe component does not truncate text that is shorter than a specified threshold, and by default, it removes newline characters from truncated text.';
}
