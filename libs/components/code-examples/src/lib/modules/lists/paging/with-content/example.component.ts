import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyDescriptionListModule } from '@skyux/layout';
import {
  SkyPagingContentChangeArgs,
  SkyPagingModule,
  SkyRepeaterModule,
} from '@skyux/lists';

import { Subject, switchMap, tap } from 'rxjs';

import { DemoDataService } from './demo-data.service';

/**
 * @title Paging with content wrapper
 */
@Component({
  selector: 'app-lists-paging-with-content-example',
  templateUrl: './example.component.html',
  imports: [SkyDescriptionListModule, SkyPagingModule, SkyRepeaterModule],
})
export class ListsPagingWithContentExampleComponent {
  #demoDataSvc = inject(DemoDataService);

  protected currentPage = 1;
  protected pageSize = 5;
  protected contentChange = new Subject<SkyPagingContentChangeArgs>();

  protected readonly pagedData = toSignal(
    this.contentChange.pipe(
      switchMap((args) =>
        this.#demoDataSvc.getPagedData(args.currentPage, this.pageSize).pipe(
          tap(() => {
            args.loadingComplete();
          }),
        ),
      ),
    ),
  );
}
