import {
  AfterViewInit,
  Component,
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  ListStateDispatcher
} from '../list/state/list-state.rxstate';

import {
  ListToolbarItemModel
} from '../list/state/toolbar/toolbar-item.model';

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

  @ViewChild('secondaryActions', {
    read: TemplateRef,
    static: true
  })
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
