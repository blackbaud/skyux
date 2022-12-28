import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkySplitViewService } from './split-view.service';

/**
 * The header to display in the split view's workspace panel.
 */
@Component({
  selector: 'sky-split-view-workspace-header',
  templateUrl: 'split-view-workspace-header.component.html',
  styleUrls: ['split-view-workspace-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkySplitViewWorkspaceHeaderComponent implements OnDestroy, OnInit {
  public backButtonText: string | undefined;

  #ngUnsubscribe = new Subject<void>();
  #splitViewSvc: SkySplitViewService;

  constructor(splitViewSvc: SkySplitViewService) {
    this.#splitViewSvc = splitViewSvc;
  }

  public ngOnInit(): void {
    this.#splitViewSvc.backButtonTextStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((text: string) => {
        this.backButtonText = text;
      });
  }

  public onShowDrawerButtonClick(): void {
    this.#splitViewSvc.backButtonClick();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}
