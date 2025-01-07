import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkySplitViewService } from './split-view.service';

/**
 * Specifies the header to display in the split view's workspace panel.
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyIconModule],
  selector: 'sky-split-view-workspace-header',
  styleUrl: './split-view-workspace-header.component.scss',
  templateUrl: './split-view-workspace-header.component.html',
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
