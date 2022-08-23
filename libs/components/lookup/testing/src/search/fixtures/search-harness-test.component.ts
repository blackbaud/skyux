import { Component } from '@angular/core';

@Component({
  selector: 'test-search-harness',
  templateUrl: './search-harness-test.component.html',
})
export class SearchHarnessTestComponent {
  public disabled = false;

  public placeholderText: string | undefined;
}
