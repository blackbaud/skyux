import { Component } from '@angular/core';

@Component({
  selector: 'test-search-harness',
  templateUrl: './search-harness-test.component.html',
  standalone: false,
})
export class SearchHarnessTestComponent {
  public ariaLabel: string | undefined;

  public ariaLabelledBy: string | undefined = 'foo-search-id';

  public disabled = false;

  public placeholderText: string | undefined;
}
