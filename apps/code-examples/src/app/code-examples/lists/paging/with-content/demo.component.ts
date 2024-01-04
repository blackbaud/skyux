import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyDescriptionListModule } from '@skyux/layout';
import {
  SkyPagingContentChangeArgs,
  SkyPagingModule,
  SkyRepeaterModule,
} from '@skyux/lists';

import { Subject, shareReplay, switchMap, tap } from 'rxjs';

import { DemoDataService } from './demo-data.service';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    CommonModule,
    SkyDescriptionListModule,
    SkyPagingModule,
    SkyRepeaterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoComponent {
  #demoDataSvc = inject(DemoDataService);

  protected currentPage = 1;
  protected pageSize = 5;
  protected contentChange = new Subject<SkyPagingContentChangeArgs>();

  protected pagedData = this.contentChange.pipe(
    switchMap((args) =>
      this.#demoDataSvc
        .getPagedData(args.currentPage, this.pageSize)
        .pipe(tap(() => args.loadingComplete())),
    ),
    shareReplay(1),
  );
}
