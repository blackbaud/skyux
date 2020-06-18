import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'app-sort-docs',
  templateUrl: './sort-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortDocsComponent { }
