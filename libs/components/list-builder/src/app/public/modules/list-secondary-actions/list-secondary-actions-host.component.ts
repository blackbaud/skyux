import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';

import 'rxjs/add/operator/distinctUntilChanged';

import {
  SkyListSecondaryActionsService
} from './list-secondary-actions.service';

import {
  SkyListSecondaryAction
} from './list-secondary-action';

// Note: this component is needed to ensure any reactive styles placed in the element have
// their host to be based off of. Without this component the host is not written via the dispatcher.

@Component({
  selector: 'sky-list-secondary-actions-host',
  templateUrl: './list-secondary-actions-host.component.html',
  styleUrls: ['./list-secondary-actions-host.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyListSecondaryActionsHostComponent implements OnInit, OnDestroy {
  public dropdownHidden = false;
  public actions: any[] = [];

  private ngUnsubscribe = new Subject();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private actionService: SkyListSecondaryActionsService
  ) { }

  public ngOnInit() {
    this.actionService.actionsStream
      .takeUntil(this.ngUnsubscribe)
      .distinctUntilChanged()
      .subscribe((actions: SkyListSecondaryAction[]) => {
        const hasSecondaryActions = (actions.length > 0);
        this.dropdownHidden = !hasSecondaryActions;
        this.actions = actions;
        this.changeDetector.detectChanges();
      });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
