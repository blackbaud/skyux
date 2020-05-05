import {
  AfterViewInit,
  Component,
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild
} from '@angular/core';

import 'rxjs/add/operator/takeUntil';

import 'rxjs/add/operator/distinctUntilChanged';

import {
  ListStateDispatcher,
  ListToolbarItemModel
} from '../list/state';

import {
  SkyListSecondaryActionsService
} from './list-secondary-actions.service';

@Component({
  selector: 'sky-list-secondary-actions',
  templateUrl: './list-secondary-actions.component.html',
  providers: [
    SkyListSecondaryActionsService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyListSecondaryActionsComponent implements AfterViewInit {
  public actions: any[] = [];

  @ViewChild('secondaryActions')
  private secondaryActionsTemplate: TemplateRef<any>;

  private secondaryActionsItemToolbarIndex: number = 5000;

  constructor(
    private dispatcher: ListStateDispatcher
  ) { }

  public ngAfterViewInit() {
    const secondaryActionItem = new ListToolbarItemModel({
      id: 'secondary-actions',
      template: this.secondaryActionsTemplate,
      location: 'center',
      index: this.secondaryActionsItemToolbarIndex
    });

    this.dispatcher.toolbarAddItems(
      [
        secondaryActionItem
      ]
    );
  }

}
