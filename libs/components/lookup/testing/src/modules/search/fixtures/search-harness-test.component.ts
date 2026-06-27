import { Component, input } from '@angular/core';

@Component({
  selector: 'test-search-harness',
  templateUrl: './search-harness-test.component.html',
  standalone: false,
})
export class SearchHarnessTestComponent {
  public ariaLabel = input<string | undefined>(undefined);

  public ariaLabelledBy = input<string | undefined>('foo-search-id');

  public disabled = input<boolean>(false);

  public placeholderText = input<string | undefined>(undefined);
}
