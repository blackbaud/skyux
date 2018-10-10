import {
  AfterViewInit,
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/distinctUntilChanged';

import {
  ListStateDispatcher,
  ListToolbarItemModel
} from '../list/state';

import { SkyListSecondaryActionsService } from './list-secondary-actions.service';
import { SkyListSecondaryAction } from './list-secondary-action';

@Component({
  selector: 'sky-list-secondary-actions',
  templateUrl: './list-secondary-actions.component.html',
  styleUrls: ['./list-secondary-actions.component.scss'],
  providers: [
    SkyListSecondaryActionsService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyListSecondaryActionsComponent implements OnInit, AfterViewInit, OnDestroy {
  public dropdownHidden = false;
  public actions: any[] = [];

  @ViewChild('secondaryActions')
  private secondaryActionsTemplate: TemplateRef<any>;

  private ngUnsubscribe = new Subject();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dispatcher: ListStateDispatcher,
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

  public ngAfterViewInit() {
    const secondaryActionItem = new ListToolbarItemModel({
      id: 'secondary-actions',
      template: this.secondaryActionsTemplate,
      location: 'left'
    });

    this.dispatcher.toolbarAddItems(
      [
        secondaryActionItem
      ]
    );
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
