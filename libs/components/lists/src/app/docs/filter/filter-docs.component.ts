import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'app-filter-docs',
  templateUrl: './filter-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterDocsComponent { }
