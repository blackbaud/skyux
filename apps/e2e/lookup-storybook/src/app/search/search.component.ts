import { Component, inject } from '@angular/core';
import { FontLoadingService } from '@skyux/storybook';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  public readonly ready$ = inject(FontLoadingService).ready();
}
