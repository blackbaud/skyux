import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'app-infinite-scroll-docs',
  templateUrl: './infinite-scroll-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfiniteScrollDocsComponent { }
