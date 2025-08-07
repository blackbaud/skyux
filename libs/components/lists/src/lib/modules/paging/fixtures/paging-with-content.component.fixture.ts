import { Component } from '@angular/core';

import { SkyPagingModule } from '../paging.module';
import { SkyPagingContentChangeArgs } from '../types/paging-content-change-args';

@Component({
  imports: [SkyPagingModule],
  template: `<sky-paging
    [itemCount]="20"
    [pageSize]="5"
    (contentChange)="onContentChange($event)"
  >
    <sky-paging-content>
      {{ pageNumber }}
    </sky-paging-content>
  </sky-paging>`,
})
export class SkyPagingWithContentTestComponent {
  public pageNumber: number | undefined;

  #lastLoadingCompleteFn: (() => void) | undefined;

  protected onContentChange(args: SkyPagingContentChangeArgs): void {
    this.pageNumber = args.currentPage;
    this.#lastLoadingCompleteFn = args.loadingComplete;
  }

  public finishLoading(): void {
    this.#lastLoadingCompleteFn?.();
    this.#lastLoadingCompleteFn = undefined;
  }
}
