import { Component, booleanAttribute, input } from '@angular/core';
import { SkyTextHighlightModule } from '@skyux/indicators';

@Component({
  standalone: true,
  selector: 'test-text-highlight-harness',
  templateUrl: './text-highlight-harness-test.component.html',
  imports: [SkyTextHighlightModule],
})
export class TextHighlightHarnessTestComponent {
  public searchTerm = input<string>();
  public showAdditionalContent = input(false, { transform: booleanAttribute });
}
