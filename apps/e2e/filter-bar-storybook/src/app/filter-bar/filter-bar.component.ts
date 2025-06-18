import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyFilterBarModule } from '@skyux/filter-bar';
import {
  SkySelectionModalSearchArgs,
  SkySelectionModalSearchResult,
} from '@skyux/lookup';

import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, SkyFilterBarModule],
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent {
  protected searchFn: (
    args: SkySelectionModalSearchArgs,
  ) => Observable<SkySelectionModalSearchResult> | undefined = () => undefined;
}
