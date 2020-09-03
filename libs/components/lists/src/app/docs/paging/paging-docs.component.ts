import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'app-paging-docs',
  templateUrl: './paging-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagingDocsComponent {

  public currentPage: number = 1;

}
