import { Component, inject } from '@angular/core';
import { FontLoadingService } from '@skyux/storybook/font-loading';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: false,
})
export class SearchComponent {
  public readonly ready$ = inject(FontLoadingService).ready();
}
